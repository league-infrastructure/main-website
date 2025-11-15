import { pike13_base_url, pike13_client_id } from "../content/config";

const USER_AGENT = "LeagueWebsite/1.0 (+https://www.jointheleague.org)";

export interface Pike13Config {
  baseUrl: string | null;
  clientId: string | null;
}

export interface Pike13ServiceDetail {
  id: number;
  name: string | null;
  description: string | null;
  summary: string | null;
  type: string | null;
}

export interface Pike13Occurrence {
  id: number;
  serviceId: number;
  name: string | null;
  description: string | null;
  locationId: number | null;
  staffNames: string[];
  startAt: string | null;
  endAt: string | null;
  url: string | null;
}

interface RawOccurrence {
  id?: number | string | null;
  service_id?: number | string | null;
  name?: unknown;
  description?: unknown;
  location_id?: number | string | null;
  staff_members?: Array<{ id?: number | string | null; name?: unknown }> | unknown;
  start_at?: unknown;
  end_at?: unknown;
  url?: unknown;
}

interface RawServiceDetail {
  id?: number | string | null;
  name?: unknown;
  description?: unknown;
  description_short?: unknown;
  summary?: unknown;
  type?: unknown;
}

const occurrenceCache = new Map<string, Promise<Pike13Occurrence[]>>();
const serviceDetailCache = new Map<number, Promise<Pike13ServiceDetail | null>>();

export function getPike13Config(): Pike13Config {
  const rawBase = typeof pike13_base_url === "string" ? pike13_base_url.trim() : "";
  const rawClient = typeof pike13_client_id === "string" ? pike13_client_id.trim() : "";
  return {
    baseUrl: rawBase.length > 0 ? rawBase.replace(/\/$/, "") : null,
    clientId: rawClient.length > 0 ? rawClient : null,
  };
}

export async function fetchServiceOccurrences(
  serviceIds: number[],
  options?: {
    start?: Date;
    end?: Date;
    limit?: number;
    config?: Pike13Config;
  },
): Promise<Pike13Occurrence[]> {
  const normalizedIds = Array.from(
    new Set(
      serviceIds
        .filter((value) => Number.isFinite(value))
        .map((value) => Math.trunc(value)),
    ),
  ).sort((a, b) => a - b);

  if (normalizedIds.length === 0) {
    return [];
  }

  const config = options?.config ?? getPike13Config();
  if (!config.baseUrl) {
    return [];
  }

  const start = new Date(options?.start ?? Date.now());
  start.setHours(0, 0, 0, 0);
  const end = new Date(options?.end ?? start);
  if (!options?.end) {
    end.setDate(start.getDate() + 7);
  }
  end.setHours(23, 59, 59, 999);

  const startIso = start.toISOString();
  const endIso = end.toISOString();
  const limit = typeof options?.limit === "number" && Number.isFinite(options.limit) && options.limit > 0
    ? Math.trunc(options.limit)
    : undefined;

  const cacheKey = JSON.stringify({ ids: normalizedIds, start: startIso, end: endIso, limit: limit ?? null });
  if (occurrenceCache.has(cacheKey)) {
    return occurrenceCache.get(cacheKey)!;
  }

  const fetchPromise = (async (): Promise<Pike13Occurrence[]> => {
    try {
      const baseUrl = new URL("/api/v2/front/event_occurrences.json", config.baseUrl ?? undefined);
      const perPage = limit ? Math.max(limit * 3, 12) : 100;
      const maxPages = 10;
      const collected: Pike13Occurrence[] = [];
      const seenIds = new Set<number>();

      for (let page = 1; page <= maxPages; page++) {
        const url = new URL(baseUrl);
        const params = url.searchParams;
        for (const id of normalizedIds) {
          params.append("service_ids[]", String(id));
        }
        params.set("starts_after", startIso);
        params.set("starts_before", endIso);
        params.set("per_page", String(perPage));
        params.set("page", String(page));
        if (config.clientId) {
          params.set("client_id", config.clientId);
        }

        const response = await fetch(url.toString(), {
          headers: buildHeaders(config.clientId),
        });

        if (!response.ok) {
          break;
        }

        const bodyText = await response.text();
        let payload: unknown;
        try {
          payload = JSON.parse(bodyText);
        } catch (_error) {
          break;
        }

        const rawOccurrences = extractOccurrences(payload);
        const normalized = rawOccurrences
          .filter((entry) => entry && normalizedIds.includes(normalizeNumber(entry.service_id)))
          .map(normalizeOccurrence)
          .filter((entry): entry is Pike13Occurrence => entry !== null);

        for (const occurrence of normalized) {
          if (occurrence.id && seenIds.has(occurrence.id)) {
            continue;
          }
          if (occurrence.id) {
            seenIds.add(occurrence.id);
          }
          collected.push(occurrence);
          if (limit && collected.length >= limit) {
            break;
          }
        }

        const received = normalized.length;
        const reachedLimit = Boolean(limit && collected.length >= limit);
        if (reachedLimit || received < perPage || received === 0) {
          break;
        }
      }

      collected.sort((a, b) => {
        const timeA = a.startAt ? Date.parse(a.startAt) : Number.POSITIVE_INFINITY;
        const timeB = b.startAt ? Date.parse(b.startAt) : Number.POSITIVE_INFINITY;
        return timeA - timeB;
      });

      return limit ? collected.slice(0, limit) : collected;
    } catch (_error) {
      return [];
    }
  })();

  occurrenceCache.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export async function fetchServiceDetail(
  serviceId: number,
  config: Pike13Config = getPike13Config(),
): Promise<Pike13ServiceDetail | null> {
  if (!Number.isFinite(serviceId) || !config.baseUrl) {
    return null;
  }

  const normalizedId = Math.trunc(serviceId);
  if (serviceDetailCache.has(normalizedId)) {
    return serviceDetailCache.get(normalizedId)!;
  }

  const fetchPromise = (async (): Promise<Pike13ServiceDetail | null> => {
    try {
      const url = new URL(`/api/v2/front/services/${normalizedId}.json`, config.baseUrl ?? undefined);
      if (config.clientId) {
        url.searchParams.set("client_id", config.clientId);
      }
      const response = await fetch(url.toString(), {
        headers: buildHeaders(config.clientId),
      });

      if (!response.ok) {
        return null;
      }

      const bodyText = await response.text();
      let payload: unknown;
      try {
        payload = JSON.parse(bodyText);
      } catch (_error) {
        return null;
      }

      const rawService = extractService(payload);
      if (!rawService) {
        return null;
      }

      return normalizeServiceDetail(rawService);
    } catch (_error) {
      return null;
    }
  })();

  serviceDetailCache.set(normalizedId, fetchPromise);
  return fetchPromise;
}

function extractOccurrences(payload: unknown): RawOccurrence[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray((payload as { event_occurrences?: unknown }).event_occurrences)) {
    return ((payload as { event_occurrences: RawOccurrence[] }).event_occurrences ?? []) as RawOccurrence[];
  }

  if (Array.isArray((payload as { events?: unknown }).events)) {
    return ((payload as { events: RawOccurrence[] }).events ?? []) as RawOccurrence[];
  }

  if (Array.isArray((payload as { data?: unknown }).data)) {
    return ((payload as { data: RawOccurrence[] }).data ?? []) as RawOccurrence[];
  }

  if (Array.isArray(payload)) {
    return payload as RawOccurrence[];
  }

  return [];
}

function extractService(payload: unknown): RawServiceDetail | null {
  if (!payload) {
    return null;
  }

  const candidate = (payload as { service?: unknown }).service;
  if (candidate && typeof candidate === "object") {
    return candidate as RawServiceDetail;
  }

  if (payload && typeof payload === "object") {
    return payload as RawServiceDetail;
  }

  return null;
}

function normalizeOccurrence(value: RawOccurrence | null | undefined): Pike13Occurrence | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const id = normalizeNumber(value.id);
  const serviceId = normalizeNumber(value.service_id);
  if (serviceId <= 0) {
    return null;
  }

  const locationId = normalizeNumber(value.location_id);
  const name = typeof value.name === "string" && value.name.trim().length > 0 ? value.name.trim() : null;
  const description = typeof value.description === "string" ? value.description : null;
  const startAt = typeof value.start_at === "string" && value.start_at.trim().length > 0 ? value.start_at.trim() : null;
  const endAt = typeof value.end_at === "string" && value.end_at.trim().length > 0 ? value.end_at.trim() : null;
  const url = typeof value.url === "string" && value.url.trim().length > 0 ? value.url.trim() : null;

  const staffMembersRaw = Array.isArray(value.staff_members) ? value.staff_members : [];
  const staffNames = staffMembersRaw
    .map((entry) => (entry && typeof entry === "object" ? (entry as { name?: unknown }).name : null))
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .map((entry) => entry.trim());

  return {
    id,
    serviceId,
    name,
    description,
    locationId: locationId > 0 ? locationId : null,
    staffNames,
    startAt,
    endAt,
    url,
  };
}

function normalizeServiceDetail(value: RawServiceDetail): Pike13ServiceDetail {
  const id = normalizeNumber(value.id);
  const name = typeof value.name === "string" && value.name.trim().length > 0 ? value.name.trim() : null;

  const descriptionCandidates = [value.description, value.description_short, value.summary];
  const description = descriptionCandidates
    .map((entry) => (typeof entry === "string" ? entry : null))
    .find((entry): entry is string => Boolean(entry && entry.trim().length > 0)) ?? null;

  const summary = typeof value.summary === "string" && value.summary.trim().length > 0 ? value.summary.trim() : null;
  const type = typeof value.type === "string" && value.type.trim().length > 0 ? value.type.trim() : null;

  return {
    id,
    name,
    description,
    summary,
    type,
  };
}

function normalizeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isFinite(parsed)) {
      return Math.trunc(parsed);
    }
  }

  return 0;
}

function buildHeaders(clientId: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": USER_AGENT,
  };

  if (clientId) {
    headers["Client-Id"] = clientId;
  }

  return headers;
}
