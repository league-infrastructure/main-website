# Pike13 Services

- [DONE] Implement the Pike13Client as described in /docs/pike13_client.md

- [DONE] Let's create a  Component, `Pike13Events` that will run in the class pages to
   get a list of the Events for a service. Get the service_id from the class
   content record's `service` field. ( but this should be a parameter to the
   component )  Dsplay these events in a Section as pretty-printed json records. 

- [DONE] Create a new page for the url `/test/p13events/` that has a basic layout and
   just the  `Pike13Events`, using the service_id 270616. Check that your
   Pike13Events component is displaying events that have "Python" in their
   names. 