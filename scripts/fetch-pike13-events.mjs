import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.resolve(__dirname, "../src/content/config.ts");
const DATA_DIR = path.resolve(__dirname, "../src/data");
const OUTPUT_PATH = path.join(DATA_DIR, "p13e-events.json");
const ENV_PATH = path.resolve(__dirname, "../.env");

const DESK_ENDPOINT_SUFFIXES = [
  "/api/v2/desk/events.json",
  "/api/v2/desk/events",
];

const FRONT_ENDPOINT_SUFFIXES = [
  "/api/v2/front/event_occurrences.json",
  "/api/v2/front/event_occurrences",
];

const DESK_RANGE_PARAM_VARIANTS = [
  { start: "starts_at", end: "ends_at" },
  { start: "start_at", end: "end_at" },
  { start: "from", end: "to" },
  { start: "start", end: "end" },
  { start: "starts_after", end: "ends_before" },
];

const FRONT_RANGE_PARAM_VARIANTS = [
  { start: "starts_after", end: "starts_before" },
  { start: "starts_after", end: "ends_before" },
  { start: "start", end: "end" },
  { start: "from", end: "to" },
];

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

  for (const suffix of DESK_ENDPOINT_SUFFIXES) {
    for (const variant of DESK_RANGE_PARAM_VARIANTS) {
      const endpointUrl = new URL(suffix, baseUrl);
      endpointUrl.searchParams.set("per_page", "200");
      endpointUrl.searchParams.set(variant.start, range.start);
      endpointUrl.searchParams.set(variant.end, range.end);
      if (clientId) {
        endpointUrl.searchParams.set("client_id", clientId);
      }

      try {
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
        try {
          const payload = JSON.parse(bodyText);
          return { payload, endpoint: endpointUrl.toString(), params: variant, source: "desk" };
        } catch (parseError) {
          throw new Error("Unexpected response payload while parsing JSON");
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

  const hasAccessDenied = failures.some((entry) =>
    /401/.test(entry.message) || entry.message.toLowerCase().includes("access denied")
  );

  if (hasAccessDenied) {
    return fetchFrontEvents(baseUrl, clientId, range, failures);
  }

  const detail = failures
    .map(
      (entry) =>
        `  • ${entry.endpoint} (${entry.params.start}/${entry.params.end}): ${entry.message}`
    )
    .join("\n");
  throw new Error(`Failed to fetch Pike13 events via available endpoints:\n${detail}`);
}

async function fetchFrontEvents(baseUrl, clientId, range, previousFailures = []) {
  const failures = [...previousFailures];

  for (const suffix of FRONT_ENDPOINT_SUFFIXES) {
    for (const variant of FRONT_RANGE_PARAM_VARIANTS) {
      const endpointUrl = new URL(suffix, baseUrl);
      endpointUrl.searchParams.set("per_page", "200");
      endpointUrl.searchParams.set(variant.start, range.start);
      endpointUrl.searchParams.set(variant.end, range.end);
      if (clientId) {
        endpointUrl.searchParams.set("client_id", clientId);
      }

      try {
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
        try {
          const payload = JSON.parse(bodyText);
          return { payload, endpoint: endpointUrl.toString(), params: variant, source: "front" };
        } catch (parseError) {
          throw new Error("Unexpected response payload while parsing JSON");
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

    const { payload, endpoint, params, source } = await fetchEvents(baseUrl, clientId, range);
    const eventsArray = Array.isArray(payload?.events)
      ? payload.events
      : Array.isArray(payload?.event_occurrences)
      ? payload.event_occurrences
      : [];

    const metadata = {
      fetched_at: new Date().toISOString(),
      endpoint,
      source,
      range,
      params,
      item_count: eventsArray.length,
    };

    await writeEvents({ metadata, events: eventsArray });
    console.log(`Saved ${metadata.item_count} Pike13 events to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void main();
