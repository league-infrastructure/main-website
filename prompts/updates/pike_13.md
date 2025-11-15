# Pike13 Services

For these tasks, you will need to refer to the Pike13 API, https://developer.pike13.com/docs/api/v2, and use the `pike13_client_id` from `config.ts`

- [DONE] Create a new component, `Pike13Occurrences`, which will take  a list of
  `service_id` and fetch a service from `/api/v2/front/services` and event
  occurrences from the `/api/v2/front/event_occurrences`. Fetch the events for
  the dates from the beginning of today to the end of 90 days from now. Then
  display the next 4 events. Initially, just display in a text format,
  displaying: name, description, staff name, location name ( lookup in
  `src/data/locations.json` ). Of course, do this only if the Content Record has
  a `service` field, which lists the `service_ids`. Display the event
  occurrances in class pages, below the Course overview and below the How to
  Enroll section. 


- [DONE] Display the Pike12 Event Occurrances in a <UL> in a Section, showing these
  fields: name, start_at, instructor name, location name

- [DONE] Display the next week of events. 

- [DONE] Oh, this is supposed to be a Javascript component that fetches records from the client. 

- [DONE] Let's create another Javascript component, `Pike13Events` that also uses the
  `service` field to match services, but then gets the events, rather than
  occurrances, using https://developer.pike13.com/docs/api/v2#endpoint-event. DIsplay these in the class pages, just before 'Upcoming Sessions'; call it "Upcomming Events". In this case, instead of the start_at, display the ical.rrule. Also display the name, start_time, instructor and location_name. 
  
- [DONE] For the `Pike13Events` component, filter out events that have an end_time in the past. 