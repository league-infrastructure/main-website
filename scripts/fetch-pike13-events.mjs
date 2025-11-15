import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.resolve(__dirname, "../src/content/config.ts");
const DATA_DIR = path.resolve(__dirname, "../src/data/p13");
const OUTPUT_PATH = path.join(DATA_DIR, "p13e-events.json");
const ENV_PATH = path.resolve(__dirname, "../.env");

const FRONT_EVENT_ENDPOINT_SUFFIXES = [
  "/api/v2/front/events.json",
  "/api/v2/front/events",
];

const FRONT_OCCURRENCE_ENDPOINT_SUFFIXES = [
  "/api/v2/front/event_occurrences.json",
  "/api/v2/front/event_occurrences",
];

const FRONT_EVENT_RANGE_PARAM_VARIANTS = [
  { start: "starts_after", end: "starts_before" },
  { start: "starts_after", end: "ends_before" },
  { start: "start_at", end: "end_at" },
  { start: "starts_at", end: "ends_at" },
  { start: "start", end: "end" },
  { start: "from", end: "to" },
];

const FRONT_OCCURRENCE_RANGE_PARAM_VARIANTS = [
  { start: "starts_after", end: "starts_before" },
  { start: "starts_after", end: "ends_before" },
  { start: "start", end: "end" },
  { start: "from", end: "to" },
];

const OMITTED_EVENT_FIELDS = new Set([
  "capacity_remaining",
  "show_capacity_to_clients",
  "show_capacity_with_spaces_remain",
  "show_capacity_threshold",
  "timezone",
]);

const PER_PAGE = 200;
const MAX_PAGES = 50;

const USER_AGENT = "LeagueWebsite/1.0 (+https://www.jointheleague.org)";
let envLoaded = false;

async function ensureEnvLoaded() {
  if (envLoaded || !existsSync(ENV_PATH)) {
    envLoaded = true;
    return;
  }

  const contents = await readFile(ENV_PATH, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }

  envLoaded = true;
}

async function readBaseUrl() {
  const configContents = await readFile(CONFIG_PATH, "utf8");
  const match = configContents.match(/pike13_base_url\s*=\s*["']([^"']+)["']/);
  if (!match) {
    throw new Error("Unable to locate pike13_base_url in config.ts");
  }

  return match[1].replace(/\/$/, "");
}

async function readClientId() {
  await ensureEnvLoaded();
  const envKeys = ["PIKE13_CLIENT_ID", "PIKE13_APPLICATION_ID", "PIKE13_APP_ID"];
  for (const key of envKeys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  const configContents = await readFile(CONFIG_PATH, "utf8");
  const match = configContents.match(/pike13_client_id\s*=\s*["']([^"']*)["']/);
  if (match && match[1].trim()) {
    return match[1].trim();
  }

  return null;
}

function buildDateRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 1);
  const end = new Date(now);
  end.setDate(end.getDate() + 110);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

async function fetchEvents(baseUrl, clientId, range) {
  const failures = [];

  for (const suffix of FRONT_EVENT_ENDPOINT_SUFFIXES) {
    for (const variant of FRONT_EVENT_RANGE_PARAM_VARIANTS) {
      const requests = [];
      const collectedEvents = [];

      try {
        for (let page = 1; page <= MAX_PAGES; page += 1) {
          const endpointUrl = new URL(suffix, baseUrl);
          endpointUrl.searchParams.set("per_page", String(PER_PAGE));
          endpointUrl.searchParams.set(variant.start, range.start);
          endpointUrl.searchParams.set(variant.end, range.end);
          endpointUrl.searchParams.set("page", String(page));
          if (clientId) {
            endpointUrl.searchParams.set("client_id", clientId);
          }

          const response = await fetch(endpointUrl, {
            headers: {
              Accept: "application/json",
              "User-Agent": USER_AGENT,
              "Client-Id": clientId ?? "",
            },
          });

          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
              `${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ""}`
            );
          }

          const bodyText = await response.text();
          let payload;
          try {
            payload = JSON.parse(bodyText);
          } catch (parseError) {
            throw new Error("Unexpected response payload while parsing JSON");
          }

          const pageEvents = extractEventsArray(payload);
          collectedEvents.push(...pageEvents);
          const totalEntries = readTotalEntries(payload);
          const totalPages = readTotalPages(payload);
          requests.push({
            endpoint: endpointUrl.toString(),
            page,
            received: pageEvents.length,
            total_entries: totalEntries,
            total_pages: totalPages,
          });

          const hasMore = shouldRequestNextPage({
            payload,
            currentPage: page,
            received: pageEvents.length,
          });

          if (!hasMore) {
            break;
          }
        }

        if (requests.length > 0) {
          return {
            events: collectedEvents,
            params: variant,
            source: "front/events",
            requests,
          };
        }
      } catch (error) {
        failures.push({
          endpoint: suffix,
          params: variant,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return fetchFrontOccurrences(baseUrl, clientId, range, failures);
}

async function fetchFrontOccurrences(baseUrl, clientId, range, previousFailures = []) {
  const failures = [...previousFailures];

  for (const suffix of FRONT_OCCURRENCE_ENDPOINT_SUFFIXES) {
    for (const variant of FRONT_OCCURRENCE_RANGE_PARAM_VARIANTS) {
      const requests = [];
      const collectedEvents = [];

      try {
        for (let page = 1; page <= MAX_PAGES; page += 1) {
          const endpointUrl = new URL(suffix, baseUrl);
          endpointUrl.searchParams.set("per_page", String(PER_PAGE));
          endpointUrl.searchParams.set(variant.start, range.start);
          endpointUrl.searchParams.set(variant.end, range.end);
          endpointUrl.searchParams.set("page", String(page));
          if (clientId) {
            endpointUrl.searchParams.set("client_id", clientId);
          }

          const response = await fetch(endpointUrl, {
            headers: {
              Accept: "application/json",
              "User-Agent": USER_AGENT,
              "Client-Id": clientId ?? "",
            },
          });

          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
              `${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ""}`
            );
          }

          const bodyText = await response.text();
          let payload;
          try {
            payload = JSON.parse(bodyText);
          } catch (parseError) {
            throw new Error("Unexpected response payload while parsing JSON");
          }

          const pageEvents = extractEventsArray(payload);
          collectedEvents.push(...pageEvents);
          const totalEntries = readTotalEntries(payload);
          const totalPages = readTotalPages(payload);
          requests.push({
            endpoint: endpointUrl.toString(),
            page,
            received: pageEvents.length,
            total_entries: totalEntries,
            total_pages: totalPages,
          });

          const hasMore = shouldRequestNextPage({
            payload,
            currentPage: page,
            received: pageEvents.length,
          });

          if (!hasMore) {
            break;
          }
        }

        if (requests.length > 0) {
          return {
            events: collectedEvents,
            params: variant,
            source: "front/event_occurrences",
            requests,
          };
        }
      } catch (error) {
        failures.push({
          endpoint: suffix,
          params: variant,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  const detail = failures
    .map(
      (entry) =>
        `  • ${entry.endpoint} (${entry.params.start}/${entry.params.end}): ${entry.message}`
    )
    .join("\n");
  throw new Error(`Failed to fetch Pike13 events via available endpoints:\n${detail}`);
}

async function writeEvents(data) {
  await mkdir(DATA_DIR, { recursive: true });
  const payload = JSON.stringify(data, null, 2);
  await writeFile(OUTPUT_PATH, `${payload}\n`, "utf8");
}

async function main() {
  try {
    const baseUrl = await readBaseUrl();
    const clientId = await readClientId();
    const range = buildDateRange();

    if (!clientId) {
      throw new Error(
        "Pike13 client ID is required. Set PIKE13_CLIENT_ID in your environment or define pike13_client_id in src/content/config.ts."
      );
    }

    const { events: eventsArray, params, source, requests } = await fetchEvents(
      baseUrl,
      clientId,
      range
    );

    const metadata = {
      fetched_at: new Date().toISOString(),
      endpoint: requests?.[0]?.endpoint ?? null,
      endpoints: Array.isArray(requests)
        ? requests.map((entry) => entry.endpoint)
        : undefined,
      source,
      range,
      params,
      item_count: eventsArray.length,
      per_page: PER_PAGE,
      pages_fetched: requests?.length ?? 0,
      total_entries: requests?.[0]?.total_entries ?? null,
      total_pages: requests?.[0]?.total_pages ?? null,
    };

    const sanitizedEvents = eventsArray.map((event) => {
      if (!event || typeof event !== "object" || Array.isArray(event)) {
        return event;
      }

      const trimmed = {};
      for (const [key, value] of Object.entries(event)) {
        if (!OMITTED_EVENT_FIELDS.has(key)) {
          trimmed[key] = value;
        }
      }

      return trimmed;
    });

    await writeEvents({ metadata, events: sanitizedEvents });
    console.log(`Saved ${metadata.item_count} Pike13 events to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void main();

function extractEventsArray(payload) {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload.events)) {
    return payload.events;
  }

  if (Array.isArray(payload.event_occurrences)) {
    return payload.event_occurrences;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}

function readTotalEntries(payload) {
  const meta = payload?.meta ?? payload?.pagination ?? payload?.pager ?? null;
  if (meta && typeof meta.total_entries === "number") {
    return meta.total_entries;
  }

  if (meta && typeof meta.total === "number") {
    return meta.total;
  }

  return null;
}

function readTotalPages(payload) {
  const meta = payload?.meta ?? payload?.pagination ?? payload?.pager ?? null;
  if (meta && typeof meta.total_pages === "number") {
    return meta.total_pages;
  }

  if (meta && typeof meta.pages === "number") {
    return meta.pages;
  }

  return null;
}

function shouldRequestNextPage({ payload, currentPage, received }) {
  const meta = payload?.meta ?? payload?.pagination ?? payload?.pager ?? null;

  if (meta) {
    if (typeof meta.current_page === "number" && typeof meta.total_pages === "number") {
      return meta.current_page < meta.total_pages;
    }

    if (typeof meta.next_page === "number") {
      return meta.next_page > currentPage;
    }

    if (meta.next || meta.next_url || meta.links?.next) {
      return true;
    }
  }

  return received === PER_PAGE && currentPage < MAX_PAGES;
}
