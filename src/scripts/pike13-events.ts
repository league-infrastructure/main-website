import { Pike13Client } from "../lib/pike13-client";

const DATA_SELECTOR = "section[data-component='pike13-events-debug']";

const formatOutput = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch (_error) {
    return String(value);
  }
};

const parseDatasetJson = (raw: string | undefined | null): unknown => {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

const normalizeServiceId = (value: unknown): number | null => {
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

const initializeHost = (host: HTMLElement) => {
  if (host.dataset.initialized === "true") {
    return;
  }
  host.dataset.initialized = "true";

  const serviceOutput = host.querySelector<HTMLElement>('[data-role="service"]');
  const eventsOutput = host.querySelector<HTMLElement>('[data-role="events"]');

  if (!serviceOutput || !eventsOutput) {
    console.error("Pike13Events: output elements missing");
    return;
  }

  const serviceIdRaw = parseDatasetJson(host.dataset.serviceId ?? "null");
  const serviceId = normalizeServiceId(serviceIdRaw);
  const baseUrl = host.dataset.baseUrl ?? "";
  const clientId = host.dataset.clientId ?? "";

  if (serviceId === null || !baseUrl) {
    const message = "Invalid configuration.";
    serviceOutput.textContent = message;
    eventsOutput.textContent = message;
    return;
  }

  let client: Pike13Client;
  try {
    client = new Pike13Client({
      baseUrl,
      clientId: clientId || null,
      services: [serviceId],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    serviceOutput.textContent = message;
    eventsOutput.textContent = message;
    return;
  }

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 1);
  const end = new Date(now);
  end.setDate(end.getDate() + 30);

  (async () => {
    try {
      serviceOutput.textContent = "Loading…";
      const serviceResult = await client.getService({ serviceId });
      serviceOutput.textContent = formatOutput(serviceResult);
    } catch (error) {
      serviceOutput.textContent = error instanceof Error ? error.message : String(error);
    }

    try {
      eventsOutput.textContent = "Loading…";
      const eventsResult = await client.getEvents({
        service_id: serviceId,
        starts_after: start.toISOString(),
        starts_before: end.toISOString(),
        per_page: 25,
        allPages: false,
      });
      eventsOutput.textContent = formatOutput(eventsResult);
    } catch (error) {
      eventsOutput.textContent = error instanceof Error ? error.message : String(error);
    }
  })();
};

export const initializePike13EventsDebug = (): void => {
  document.querySelectorAll<HTMLElement>(DATA_SELECTOR).forEach((host) => {
    initializeHost(host);
  });
};

const bootstrap = () => {
  initializePike13EventsDebug();
  const observer = new MutationObserver(() => {
    document.querySelectorAll<HTMLElement>(DATA_SELECTOR).forEach((host) => {
      initializeHost(host);
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
