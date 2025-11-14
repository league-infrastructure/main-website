# Misc Updates

- [DONE] The CardFooter need to have  margin or padding  similar to the body
  content.

- [DONE] Give the page footer 70px padding, ( for all pages ), and remove the
  gap between the footer and body in the ClassLayout and ProgramLayout.  

- [DONE] On the individual programs page, change the images in "Classes in this
  Program" to have the title of the class below the image. Make both the image
  and the title a link to ( on the same page ) a list of ClassCard,  the list
  the classes in the program, in the same format as on the main programs page. 

- [DONE] In program pages, keep the class-gallery, but remove the related-classes. 

- [DONE] Create an npm script that fetches `<base_url>/api/v2/front/services`.  THe
  `base_url` is pike13_base_url in config.ts. Store the services in the
  `src/data/` dir and add it to the build process. 


- [DONE] Update the programs page to split the Programs section on the programs.astro
  page into two sections : "Weekly Classes" which displays the programs in the
  `group-classes` category, and the "Community Programs" which displays the
  programs in the `community-tech` category. For each section, use the title for
  the category ( matched by slug ) from the categories data. 

- [DONE] Update the programs page to include the enrollment information from the
  categories.json data. The `<enroll>` content should be placed in the category
  section, after the ProgramCards. After the text, generate the buttons, which
  should be in a single row and centered horizontally. 

- [DONE] On the programs page, make the class cards be two per row, and break them in
  to sections by category. Use the `group` value for the class to assign it to a
  group. For each group, display the title of the group and the group blurb, then
  list the class cards, two per row.

- [DONE] For the class entries in the single Program pages ( like
  `/programs/java-programming`) use the ClassCards that are also on the
  programs.astro page. 

- [DONE] On the individual class pages, get the enrollment information from the
  category for the class ( in the class, this is the `group` slug. ) If there is
  enrollment information in the category, display a "How to Enroll" section on
  the class page with the enrollment text and enrollment buttons. 

- In `classes.md` add an "<enroll>...</enroll>" content section to each of the
  class entries, right after `<content>`. Set the message to be of the form
  "<Class Name> is included in our Weekly Classes, so to take this class enroll
  in weekly classes and tell your instuctor" for classes that are part of the
  Weekly classes category. For things that are in tech club or community tech,
  use "<Class Name> is offered through out Tech Club program, so to take this
  class, join the Tech Club and watch for announcements. ". Then change the
  class pages so the enrollment message for the class displays just before the
  enrollment message for the group. 