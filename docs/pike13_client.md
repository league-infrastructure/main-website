# Pike 13 Client

This specification describes the implementation of a Typescript class for
fetching data from the Pike13 API, as described at
https://developer.pike13.com/docs/api/v2. This client will be used without
authentication, so it will use the `/front/` interfaces, not the `/desk/`
interfaces. 

The main class will be the `Pike13Client` class, which will have these methods: 

- constructor. No args, gets the configuration for the clienbt id from config.ts. 
- `fetchPage(url: string, page?: number)`. Fetches a page of results or the first
  page with no `page` arg. 
- `fetchPages(url: string)` Fetch all pages of resutls from a url
- `getService(service_id: string|number): P13Service[]`. Get services from
/api/v2/front/services - `getServiceEvents(service_ids: string[]|number[], from: string|Date, to: string|date): P13Event[]`. Get events from /api/v2/front/events
- `getServiceOccurrrances(service_ids: string[]|number[], from: string|Date, to: string|date): P13Occurrence[]`. Get event occurrances from
/api/v2/front/event_occurrences


This code will be called from the client, so it must be implement in a way that
it can be deployed to the client.  

