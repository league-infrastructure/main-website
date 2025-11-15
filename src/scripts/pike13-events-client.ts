import { Pike13Client } from "../lib/pike13-client";

interface EventsSection {
  container: HTMLElement;
  output: HTMLElement;
  serviceId: string;
  baseUrl: string;
  clientId: string;
  localTz: string;
  template: HTMLTemplateElement | null;
}

  // Sort by name, then weekday order, then time
const dayOrder = new Map<string, number>([
    ['Sunday', 0], ['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thursday', 4], ['Friday', 5], ['Saturday', 6],
  ]);

function findEventsSections(): EventsSection[] {
  const sections = document.querySelectorAll<HTMLElement>('[data-component="pike13-events"]');
  const results: EventsSection[] = [];

  sections.forEach((container) => {
    const output = container.querySelector<HTMLElement>('.pike13-events__output');
    const serviceId = container.getAttribute('data-service-id');
    const baseUrl = container.getAttribute('data-base-url');
    const clientId = container.getAttribute('data-client-id');
    const localTz = container.getAttribute('data-local-tz');
    const template = container.querySelector<HTMLTemplateElement>('template[data-pike13-item-template]');

    if (output && serviceId && baseUrl && clientId && localTz) {
      results.push({ container, output, serviceId, baseUrl, clientId, localTz, template });
    }
  });

  return results;
}

async function loadEvents(section: EventsSection): Promise<void> {
  const { output, serviceId, baseUrl, clientId, localTz, template } = section;

  try {
    console.log('[Pike13Events] Loading events for service:', serviceId);
    console.log('[Pike13Events] Base URL:', baseUrl);
    console.log('[Pike13Events] Client ID:', clientId);

    output.textContent = 'Loading events...';

    const client = new Pike13Client({
      baseUrl,
      clientId,
    });
    // Explicitly set from (start of today) and to (8 weeks from today)
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    to.setDate(to.getDate() + 56);
    to.setHours(23, 59, 59, 999);
    console.log('[Pike13Events] Date window:', { from: from.toISOString(), to: to.toISOString() });
    // Build debug URL (mirrors client logic) for transparency
    const debugUrl = new URL('/api/v2/front/events', baseUrl);
    debugUrl.searchParams.set('client_id', clientId);
      debugUrl.searchParams.set('service_ids', serviceId);
    debugUrl.searchParams.set('from', from.toISOString());
    debugUrl.searchParams.set('to', to.toISOString());
    console.log('[Pike13Events] Debug Request URL:', debugUrl.toString());

    const events = await client.getServiceEvents([serviceId], from, to);
    console.log('[Pike13Events] Events received:', Array.isArray(events) ? events.length : 'non-array');
    if (Array.isArray(events) && events.length > 0) {
      console.log('[Pike13Events] First event sample:', events[0]);
    }

    if (events.length === 0) {
      output.textContent = 'No events found for this service.';
    } else {
      const items = extractFormattedItems(events as unknown[], localTz);
      if (items.length === 0) {
        const debug = Array.isArray(events) && events.length > 0
          ? `No displayable event schedule data found. Received ${events.length} event(s).`
          : 'No displayable event schedule data found.';
        output.textContent = debug;
      } else {
        if (!template) {
          output.textContent = 'Error: No template provided for rendering events.';
          return;
        }
        output.innerHTML = renderWithTemplate(items, template);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    output.textContent = `Error loading events: ${errorMessage}`;
    console.error('[Pike13Events] Error:', error);
  }
}

async function init(): Promise<void> {
  const sections = findEventsSections();

  if (sections.length === 0) {
    return;
  }

  await Promise.all(sections.map((section) => loadEvents(section)));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void init());
} else {
  void init();
}

console.log('[Pike13Events] Pike13 Events Client loaded.');

type AnyRecord = Record<string, any>;

interface FormattedItem {
  name: string;
  day: string;
  time: string; // HH:MM start time
  endTime: string; // HH:MM end time
}

function extractFormattedItems(events: unknown[], local_timezone: string): FormattedItem[] {
  const results: FormattedItem[] = [];
  const seen = new Set<string>();

  // Build an index->name array based on dayOrder to avoid duplicate mappings
  const dayIndexToName: readonly string[] = (() => {
    const arr: string[] = [];
    dayOrder.forEach((idx, name) => {
      arr[idx] = name;
    });
    return arr;
  })();

  const toDayName = (v: unknown): string | null => {
    if (typeof v === 'number' && Number.isFinite(v)) {
      const n = Math.trunc(v);
      if (n >= 0 && n <= 6) return dayIndexToName[n] ?? null;
    }
    if (typeof v === 'string') {
      const t = v.trim();
      if (/^\d+$/.test(t)) {
        const n = Number.parseInt(t, 10);
        if (n >= 0 && n <= 6) return dayIndexToName[n] ?? null;
      }
      // If already a name, match case-insensitively against keys in dayOrder
      for (const name of dayOrder.keys()) {
        if (name.toLowerCase() === t.toLowerCase()) return name;
      }
    }
    return null;
  };

  const timeFmt = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: local_timezone,
  });

  const formatTime = (isoLike: unknown): string | null => {
    if (typeof isoLike !== 'string' || !isoLike.trim()) return null;
    const d = new Date(isoLike);
    if (Number.isNaN(d.getTime())) return null;
    // Using parts to enforce HH:MM in current locale
    const parts = timeFmt.formatToParts(d);
    const hh = parts.find(p => p.type === 'hour')?.value ?? '';
    const mm = parts.find(p => p.type === 'minute')?.value ?? '';
    if (!hh || !mm) return null;
    return `${hh}:${mm}`;
  };

  for (const e of events) {
    const ev = e as AnyRecord;
    const name: string | undefined = typeof ev?.name === 'string' ? ev.name : undefined;

    const endTime =  ev?.end_time 

    // if end time is set, check that it is a time that is after today; 
    // the end_time value is the time and date after which there will be no more 
    //  occurrences of this event.

    if (typeof endTime === 'string') {
        const endDate = new Date(endTime);
        const now = new Date();
        if (endDate < now) {
            // skip this event as it has already ended
            continue;
        }
    }

    const icals: unknown = ev?.icals;
    if (!name  || !Array.isArray(icals)) continue;

    for (const ic of icals) {
      const entry = ic as AnyRecord;
      const startRaw = entry?.start_at ?? entry?.starts_at ?? entry?.start ?? entry?.startAt;
      const time = formatTime(startRaw) || '??:??';


      let daysRaw = entry?.day ?? entry?.weekday ?? entry?.day_of_week ?? entry?.wday;
      const dayValues: Array<string | number> = Array.isArray(daysRaw) ? daysRaw : [daysRaw];

      // If day array empty or invalid, derive from start time
      const derivedDayName = !dayValues || dayValues.length === 0 || (dayValues.length === 1 && (dayValues[0] === undefined || dayValues[0] === null || (Array.isArray(dayValues[0]) && (dayValues[0] as any[]).length === 0)))
        ? toDayName(new Date(startRaw).getDay())
        : null;

      if (derivedDayName) {
        const key = `${name}::${derivedDayName}::${time}::${endTime}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ name, day: derivedDayName, time, endTime });
        }
        continue;
      }

      for (const d of dayValues) {
        const v = Array.isArray(d) ? (d[0] as unknown) : d as unknown;
        const dayName = toDayName(v);
        if (!dayName) continue;
        const key = `${name}::${dayName}::${time}::${endTime}`;
        if (seen.has(key)) continue;
        seen.add(key);
        results.push({ name, day: dayName, time, endTime });
      }
    }
  }


  results.sort((a, b) => {
    const da = dayOrder.get(a.day) ?? 99;
    const db = dayOrder.get(b.day) ?? 99;
    if (da !== db) return da - db;
    const n = a.name.localeCompare(b.name);
    if (n !== 0) return n;
    return a.time.localeCompare(b.time);
  });

  return results;
}

function renderWithTemplate(items: FormattedItem[], template: HTMLTemplateElement): string {
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const clone = template.content.cloneNode(true) as DocumentFragment;
    
    // Replace data attributes and text content
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const el = node as HTMLElement;
      
      // Replace data-pike13-* attributes with actual values
      if (el.hasAttribute('data-pike13-name')) {
        el.textContent = item.name;
      }
      if (el.hasAttribute('data-pike13-day')) {
        el.textContent = item.day;
      }
      if (el.hasAttribute('data-pike13-time')) {
        el.textContent = item.time;
      }
      if (el.hasAttribute('data-pike13-endtime')) {
        el.textContent = item.endTime;
      }
      if (el.hasAttribute('data-pike13-time-range')) {
        el.textContent = `${item.time}\u2013${item.endTime}`;
      }
    }
    
    fragment.appendChild(clone);
  });
  
  const container = document.createElement('div');
  container.appendChild(fragment);
  return container.innerHTML;
}