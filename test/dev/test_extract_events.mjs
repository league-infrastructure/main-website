import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../../data/pike13-events-270616.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const json = JSON.parse(raw);
const events = json.events || [];

const local_timezone = 'America/Los_Angeles';

const dayNames0to6 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayNames1to7 = [undefined, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function toDayName(v) {
  if (typeof v === 'number' && Number.isFinite(v)) {
    const n = Math.trunc(v);
    if (n >= 0 && n <= 6) return dayNames0to6[n];
    if (n >= 1 && n <= 7) return dayNames1to7[n] || null;
  }
  if (typeof v === 'string') {
    const t = v.trim();
    if (/^\d+$/.test(t)) {
      const n = Number.parseInt(t, 10);
      if (n >= 0 && n <= 6) return dayNames0to6[n];
      if (n >= 1 && n <= 7) return dayNames1to7[n] || null;
    }
    const idx0 = dayNames0to6.findIndex(d => d.toLowerCase() === t.toLowerCase());
    if (idx0 >= 0) return dayNames0to6[idx0];
    const idx1 = dayNames1to7.findIndex(d => (d || '').toLowerCase() === t.toLowerCase());
    if (idx1 >= 0) return dayNames1to7[idx1] || null;
  }
  return null;
}

const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: local_timezone,
});

function formatTime(isoLike) {
  if (typeof isoLike !== 'string' || !isoLike.trim()) return null;
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return null;
  const parts = timeFmt.formatToParts(d);
  const hh = parts.find(p => p.type === 'hour')?.value || '';
  const mm = parts.find(p => p.type === 'minute')?.value || '';
  if (!hh || !mm) return null;
  return `${hh}:${mm}`;
}

function extractFormattedItems(events) {
  const results = [];
  const seen = new Set();
  for (const ev of events) {
    const name = typeof ev?.name === 'string' ? ev.name : undefined;
    const icals = ev?.icals;
    if (!name || !Array.isArray(icals)) continue;
    for (const ic of icals) {
      const startRaw = ic?.start_at ?? ic?.starts_at ?? ic?.start ?? ic?.startAt;
      const time = formatTime(startRaw);
      if (!time) continue;
      let daysRaw = ic?.day ?? ic?.weekday ?? ic?.day_of_week ?? ic?.wday;
      const dayValues = Array.isArray(daysRaw) ? daysRaw : [daysRaw];
      const derivedDayName = !dayValues || dayValues.length === 0 || (dayValues.length === 1 && (dayValues[0] === undefined || dayValues[0] === null || (Array.isArray(dayValues[0]) && dayValues[0].length === 0)))
        ? toDayName(new Date(startRaw).getDay())
        : null;
      if (derivedDayName) {
        const key = `${name}::${derivedDayName}::${time}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ name, day: derivedDayName, time });
        }
        continue;
      }
      for (const d of dayValues) {
        const v = Array.isArray(d) ? (d[0]) : d;
        const dayName = toDayName(v);
        if (!dayName) continue;
        const key = `${name}::${dayName}::${time}`;
        if (seen.has(key)) continue;
        seen.add(key);
        results.push({ name, day: dayName, time });
      }
    }
  }
  const dayOrder = new Map([
    ['Sunday', 0], ['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thursday', 4], ['Friday', 5], ['Saturday', 6],
  ]);
  results.sort((a, b) => {
    const n = a.name.localeCompare(b.name);
    if (n !== 0) return n;
    const da = dayOrder.get(a.day) ?? 99;
    const db = dayOrder.get(b.day) ?? 99;
    if (da !== db) return da - db;
    return a.time.localeCompare(b.time);
  });
  return results;
}

const items = extractFormattedItems(events);
console.log('Items:', items.length);
console.log(items.slice(0, 10));
