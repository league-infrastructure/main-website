import { Pike13Client } from "../lib/pike13-client";

interface EventsSection {
  container: HTMLElement;
  output: HTMLElement;
  serviceId: string;
  baseUrl: string;
  clientId: string;
}

function findEventsSections(): EventsSection[] {
  const sections = document.querySelectorAll<HTMLElement>('[data-component="pike13-events"]');
  const results: EventsSection[] = [];

  sections.forEach((container) => {
    const output = container.querySelector<HTMLElement>('.pike13-events__output');
    const serviceId = container.getAttribute('data-service-id');
    const baseUrl = container.getAttribute('data-base-url');
    const clientId = container.getAttribute('data-client-id');

    if (output && serviceId && baseUrl && clientId) {
      results.push({ container, output, serviceId, baseUrl, clientId });
    }
  });

  return results;
}

async function loadEvents(section: EventsSection): Promise<void> {
  const { output, serviceId, baseUrl, clientId } = section;

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

    if (events.length === 0) {
      output.textContent = 'No events found for this service.';
    } else {
      const prefix = `Request URL: ${debugUrl.toString()}\n\n`;
      output.textContent = prefix + JSON.stringify(events, null, 2);
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