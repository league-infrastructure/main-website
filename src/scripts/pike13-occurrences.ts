import { Pike13Client } from "../lib/pike13-client";

const DATA_SELECTOR = "section[data-component='pike13-occurrences']";

const parseJson = <T>(value: string | undefined | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch (_error) {
    return fallback;
  }
};

const normalizeId = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
  }
  return null;
};

const normalizeIds = (values: unknown): number[] => {
  if (!Array.isArray(values)) {
    return [];
  }
  return Array.from(
    new Set(
      values
        .map((value) => normalizeId(value))
        .filter((value): value is number => value !== null),
    ),
  ).sort((a, b) => a - b);
};

const formatDateTime = (isoString: string | null | undefined): string | null => {
  if (!isoString || typeof isoString !== "string") {
    return null;
  }
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return isoString;
  }
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Los_Angeles",
    }).format(parsed);
  } catch (_error) {
    return parsed.toLocaleString("en-US");
  }
};

interface NormalizedOccurrence {
  id: number | null;
  name: string | null;
  startAt: string | null;
  locationId: number | null;
  instructor: string | null;
}

const initializeHost = (section: HTMLElement) => {
  if (section.dataset.initialized === "true") {
    return;
  }
  section.dataset.initialized = "true";

  const statusEl = section.querySelector<HTMLElement>('[data-role="status"]');
  const listEl = section.querySelector<HTMLElement>('[data-role="list"]');
  const locations = parseJson<Record<string, string>>(section.dataset.locations, {});

  const serviceIds = normalizeIds(parseJson(section.dataset.serviceIds, []));
  const limitAttr = section.dataset.limit ?? "";
  const limitNumber = Number.parseInt(limitAttr, 10);
  const limitValue = Number.isFinite(limitNumber) && limitNumber > 0 ? limitNumber : null;

  const baseUrl = section.dataset.baseUrl ?? "";
  const clientId = section.dataset.clientId ?? "";

  if (serviceIds.length === 0 || !baseUrl) {
    if (statusEl) {
      statusEl.textContent = "No upcoming sessions available.";
    }
    return;
  }

  let client: Pike13Client;
  try {
    client = new Pike13Client({
      baseUrl,
      clientId: clientId || null,
      services: serviceIds,
    });
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = error instanceof Error ? error.message : String(error);
    }
    return;
  }

  const renderOccurrences = (items: NormalizedOccurrence[]) => {
    if (!listEl) {
      return;
    }

    listEl.innerHTML = "";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "pike13-occurrences__item";

      if (item.name) {
        const nameEl = document.createElement("p");
        nameEl.className = "pike13-occurrences__name";
        nameEl.textContent = item.name;
        li.appendChild(nameEl);
      }

      if (item.startAt) {
        const startEl = document.createElement("p");
        startEl.className = "pike13-occurrences__meta";
        const label = document.createElement("span");
        label.className = "pike13-occurrences__label";
        label.textContent = "start_at:";
        startEl.appendChild(label);
        startEl.append(" ");
        const formatted = formatDateTime(item.startAt);
        startEl.append(formatted ?? item.startAt);
        li.appendChild(startEl);
      }

      const locationEl = document.createElement("p");
      locationEl.className = "pike13-occurrences__meta";
      const locationLabel = document.createElement("span");
      locationLabel.className = "pike13-occurrences__label";
      locationLabel.textContent = "Location:";
      locationEl.appendChild(locationLabel);
      locationEl.append(" ");
      const lookupKey = item.locationId !== null ? String(item.locationId) : null;
      const locationName = lookupKey && lookupKey in locations ? locations[lookupKey] : "Location To Be Announced";
      locationEl.append(locationName);
      li.appendChild(locationEl);

      if (item.instructor) {
        const instructorEl = document.createElement("p");
        instructorEl.className = "pike13-occurrences__meta";
        const instructorLabel = document.createElement("span");
        instructorLabel.className = "pike13-occurrences__label";
        instructorLabel.textContent = "Instructor:";
        instructorEl.appendChild(instructorLabel);
        instructorEl.append(" ");
        instructorEl.append(item.instructor);
        li.appendChild(instructorEl);
      }

      listEl.appendChild(li);
    });

    listEl.hidden = items.length === 0;
  };

  (async () => {
    if (statusEl) {
      statusEl.textContent = "Loading upcoming sessions…";
    }

    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      end.setHours(23, 59, 59, 999);

      const perPage = limitValue ? Math.max(limitValue * 3, 12) : 100;

      const result = await client.getOccurrances({
        starts_after: start.toISOString(),
        starts_before: end.toISOString(),
        per_page: perPage,
        include: "staff_members,locations",
        maxPages: 10,
      });

      const rawItems: unknown[] = Array.isArray((result as { items?: unknown }).items)
        ? ((result as { items: unknown[] }).items)
        : Array.isArray((result as { data?: { event_occurrences?: unknown[] } }).data?.event_occurrences)
        ? ((result as { data: { event_occurrences: unknown[] } }).data.event_occurrences)
        : [];

      const serviceIdSet = new Set(serviceIds);

      const normalized: NormalizedOccurrence[] = [];

      rawItems.forEach((candidate) => {
        if (!candidate || typeof candidate !== "object") {
          return;
        }

        const entry = candidate as Record<string, unknown>;
        const serviceId = normalizeId(entry.service_id ?? entry.serviceId ?? entry.serviceID);
        if (serviceId !== null && !serviceIdSet.has(serviceId)) {
          return;
        }

        const startAt = typeof entry.start_at === "string" && entry.start_at.trim().length > 0 ? entry.start_at.trim() : null;
        const locationId = normalizeId(entry.location_id ?? entry.locationId);
        const name = typeof entry.name === "string" && entry.name.trim().length > 0 ? entry.name.trim() : null;

        const staffMembers = Array.isArray(entry.staff_members) ? entry.staff_members : [];
        const instructorName = staffMembers
          .map((member) => (member && typeof member === "object" ? (member as { name?: unknown }).name : null))
          .find((value) => typeof value === "string" && value.trim().length > 0);
        const instructor = typeof instructorName === "string" ? instructorName.trim() : null;

        const rawId = normalizeId(entry.id ?? entry.event_occurrence_id ?? entry.occurrence_id);

        normalized.push({
          id: rawId,
          name,
          startAt,
          locationId,
          instructor,
        });
      });

      normalized.sort((a, b) => {
        const timeA = a.startAt ? Date.parse(a.startAt) : Number.POSITIVE_INFINITY;
        const timeB = b.startAt ? Date.parse(b.startAt) : Number.POSITIVE_INFINITY;
        return timeA - timeB;
      });

      const limited = limitValue ? normalized.slice(0, limitValue) : normalized;

      if (limited.length === 0) {
        if (statusEl) {
          statusEl.textContent = "No sessions scheduled this week.";
        }
        return;
      }

      if (statusEl) {
        statusEl.remove();
      }

      renderOccurrences(limited);
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = "Unable to load sessions right now.";
      }
      console.error("Pike13Occurrences", error);
    }
  })();
};

export const initializePike13Occurrences = (): void => {
  document.querySelectorAll<HTMLElement>(DATA_SELECTOR).forEach((section) => {
    initializeHost(section);
  });
};

const bootstrap = () => {
  initializePike13Occurrences();
  const observer = new MutationObserver(() => {
    document.querySelectorAll<HTMLElement>(DATA_SELECTOR).forEach((section) => {
      initializeHost(section);
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
}
