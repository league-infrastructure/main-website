import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadConfig() {
  const configPath = path.resolve(__dirname, "../../src/content/config.ts");
  const contents = await readFile(configPath, "utf8");
  const baseMatch = contents.match(/pike13_base_url\s*=\s*["']([^"']+)["']/);
  if (!baseMatch) {
    throw new Error("pike13_base_url not found in config");
  }
  const baseUrl = baseMatch[1].replace(/\/+$/, "");
  const clientId = process.env.PIKE13_CLIENT_ID ?? "";
  if (!clientId) {
    throw new Error("Missing PIKE13_CLIENT_ID environment variable");
  }
  return { baseUrl, clientId };
}

function buildRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 90);
  end.setHours(23, 59, 59, 999);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

async function fetchOccurrences({ baseUrl, clientId }, serviceIds) {
  const { startIso, endIso } = buildRange();
  const perPage = 100;
  const maxPages = 3;
  const collected = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = new URL("/api/v2/front/event_occurrences.json", baseUrl);
    serviceIds.forEach((id) => url.searchParams.append("service_ids[]", String(id)));
    url.searchParams.set("starts_after", startIso);
    url.searchParams.set("starts_before", endIso);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("include", "staff_members,locations");
    url.searchParams.set("client_id", clientId);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const payload = await response.json();
    const occurrences = Array.isArray(payload?.event_occurrences)
      ? payload.event_occurrences
      : [];

    collected.push(...occurrences);
    if (occurrences.length < perPage) {
      break;
    }
  }

  return { collected, startIso, endIso };
}

async function fetchEventDetails({ baseUrl, clientId }, eventIds) {
  const details = new Map();

  for (const eventId of eventIds) {
    const url = new URL(`/api/v2/front/events/${eventId}.json`, baseUrl);
    url.searchParams.set("client_id", clientId);
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      continue;
    }

    const payload = await response.json();
    const event = Array.isArray(payload?.events) ? payload.events[0] : payload?.event;
    if (event) {
      details.set(eventId, event);
    }
  }

  return details;
}

async function main() {
  const { baseUrl, clientId } = await loadConfig();
  const serviceIds = [270616];
  const { collected: occurrences } = await fetchOccurrences({ baseUrl, clientId }, serviceIds);
  console.log(`Fetched ${occurrences.length} occurrences`);
  const sortedStarts = occurrences
    .map((item) => ({ start: item?.start_at, service: item?.service_id }))
    .filter((item) => String(item.service) === "270616")
    .map((item) => item.start)
    .filter(Boolean)
    .sort();
  console.log("Start times for service 270616:", sortedStarts);

  const serviceIdSet = new Set(serviceIds);
  const occurrencesByEvent = new Map();

  for (const entry of occurrences) {
    const rawServiceId = entry?.service_id ?? entry?.serviceId;
    const serviceId = Number.parseInt(rawServiceId, 10);
    if (!Number.isFinite(serviceId) || !serviceIdSet.has(serviceId)) {
      continue;
    }

    const rawEventId = entry?.event_id ?? entry?.id;
    const eventId = Number.parseInt(rawEventId, 10);
    if (!Number.isFinite(eventId)) {
      continue;
    }

    const startAt = typeof entry?.start_at === "string" ? entry.start_at : null;
    const endAt = typeof entry?.end_at === "string" ? entry.end_at : null;
    const instructor = Array.isArray(entry?.staff_members)
      ? entry.staff_members.map((member) => member?.name).find((name) => typeof name === "string" && name.trim()) ?? null
      : null;

    const existing = occurrencesByEvent.get(eventId);
    if (!existing) {
      occurrencesByEvent.set(eventId, {
        eventId,
        name: typeof entry?.name === "string" ? entry.name : null,
        startAt,
        endAt,
        locationId: entry?.location_id ?? null,
        instructor,
        url: typeof entry?.url === "string" ? entry.url : null,
      });
    } else {
      const existingStart = existing.startAt ? Date.parse(existing.startAt) : Number.POSITIVE_INFINITY;
      const candidateStart = startAt ? Date.parse(startAt) : Number.POSITIVE_INFINITY;
      if (candidateStart < existingStart) {
        occurrencesByEvent.set(eventId, {
          ...existing,
          startAt,
          endAt,
          instructor,
          url: typeof entry?.url === "string" ? entry.url : existing.url,
        });
      }
    }
  }

  console.log(`Unique events: ${occurrencesByEvent.size}`);

  const eventDetails = await fetchEventDetails({ baseUrl, clientId }, [...occurrencesByEvent.keys()]);

  const events = [...occurrencesByEvent.values()].map((entry) => {
    const details = eventDetails.get(entry.eventId);
    const icals = Array.isArray(details?.icals) ? details.icals : [];
    const primaryIcal = icals.find((ical) => ical && typeof ical === "object") ?? null;
    const schedule = typeof primaryIcal?.rrule === "string" && primaryIcal.rrule.trim().length > 0
      ? primaryIcal.rrule.trim()
      : details?.recurs === true
      ? "Recurring schedule"
      : null;

    return {
      ...entry,
      schedule,
    };
  });

  const now = Date.now();
  const upcoming = events.filter((item) => {
    if (item.startAt) {
      const startTime = Date.parse(item.startAt);
      if (!Number.isNaN(startTime) && startTime < now) {
        return false;
      }
    }

    if (!item.endAt) {
      return true;
    }

    const endTime = Date.parse(item.endAt);
    if (Number.isNaN(endTime)) {
      return true;
    }

    return endTime >= now;
  });

  upcoming.sort((a, b) => {
    const timeA = a.startAt ? Date.parse(a.startAt) : Number.POSITIVE_INFINITY;
    const timeB = b.startAt ? Date.parse(b.startAt) : Number.POSITIVE_INFINITY;
    return timeA - timeB;
  });

  console.log(JSON.stringify(upcoming, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
