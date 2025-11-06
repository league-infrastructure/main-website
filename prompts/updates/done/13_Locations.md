# Locations

- [DONE] Look in the `src/data/locations.ts` and `src/data/locations.json` files.
  Extract an interface from the JSON file and add it to the `.ts` file as type
  `Location`. include a 'type' field but allow it to be optional. 

- [DONE] iterate through the locations to create a new field called 'type', the type of
  location. Extract the type with these rules: If it has "[Li]brary" in the
  name, it is a library. If it has 'St.', 'Alliance', 'Learning' or 'Academy' in
  the name, it is a school. If not any of these, leave it null. 
  
- [DONE] Create a new data structure in locations.ts for `locationExtras` which is a
  map from the code to a map of `Location`. Immediately after this
  datastructure, create `locationsMap` that maps from location codes to objects
  in the `locations` list. Then iterate over the map and update the `locations`
  objects, matching on the code. That is, you will take all of the non-null
  entries in the `locationsExtras` maps and assign them to the corresponding
  entries and fields in the `locationsMap`. Create default entries for CV, VL
  and BW, and set the 'type' to 'league'

- [DONE] Create a new kind of card component, LocationCard, which includes a location
  name, the location address and type of location. 

- [DONE] At the end of the `about/locations.astro` page, add new sections with CardGridsn for: League
  Sites ( CV, VL and BW ), Schools, Libraries and others, based on type. 

- [DONE] Make the type lozenge optional, and configure it off for the locations page. 

- [DONE] Process the location names to remove the code in parenthesis on display. 