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


- [DONE] Update the programs page to split the Programs section on the
  programs.astro page into two sections : "Weekly Classes" which displays the
  programs in the `group-classes` category, and the "Community Programs" which
  displays the programs in the `community-tech` category. For each section, use
  the title for the category ( matched by slug ) from the categories data. 

- [DONE] Update the programs page to include the enrollment information from the
  categories.json data. The `<enroll>` content should be placed in the category
  section, after the ProgramCards. After the text, generate the buttons, which
  should be in a single row and centered horizontally. 

- [DONE] On the programs page, make the class cards be two per row, and break
  them in to sections by category. Use the `group` value for the class to assign
  it to a group. For each group, display the title of the group and the group
  blurb, then list the class cards, two per row.

- [DONE] For the class entries in the single Program pages ( like
  `/programs/java-programming`) use the ClassCards that are also on the
  programs.astro page. 

- [DONE] On the individual class pages, get the enrollment information from the
  category for the class ( in the class, this is the `group` slug. ) If there is
  enrollment information in the category, display a "How to Enroll" section on
  the class page with the enrollment text and enrollment buttons. 

- [DONE] In `classes.md` add an "<enroll>...</enroll>" content section to each of the
  class entries, right after `<content>`. Set the message to be of the form
  "<Class Name> is included in our Weekly Classes, so to take this class enroll
  in weekly classes and tell your instuctor" for classes that are part of the
  Weekly classes category. For things that are in tech club or community tech,
  use "<Class Name> is offered through out Tech Club program, so to take this
  class, join the Tech Club and watch for announcements. ". Then change the
  class pages so the enrollment message for the class displays just before the
  enrollment message for the group. 

- [DONE] Lets convert the policy.astro file to use the content file
  src/content/policies.md. Remove all of the policy entries from the
  policies.astro file and create content record entries in policies.md. Be sure
  to refer to docs/content_spec.md for a guide to creating these records.  The
  body of the policy section becomes the `<content>` entry. You should summarize
  the content to create the description and th blurb. the <h2> heading for the
  policy becomes the title of the block. 

- [DONE] After converting the policy enries to `policies.md`, update the export-content
  script to read `policies.md`, and also `faqs.md`, if it exists, and
  `content.md` if it exists. Run the `export-content` to generate the json files. 

- [DONE] After updating the JSON files, update the `policy.astro` page to use the
  policies.json data to generate the page. 

- [DONE] The `buttons:` metadata entry in the content records has been changed to
  `cta:`. Ensure that the content_spec and the `export-content` scripts are
  updated with the new value.

- [DONE] The interface for the content records is defined multiple times, independently
  for each of policies, programs, classes, etc. It should only be defined once,
  in a common source file. Same with the CTA interface. Also, there should not
  be independently impemented acess functions, like `getClassesData()`. You
  might have these be a thin wrapper on a Content Record loading function, but
  there should not be completely seperate implementation. So, create
  `getStructuredContent(name: string)` that will: check if
  `src/content/<name>.md` is newer than `src/data/<name>.json`. If it is, re-gen
  the .json file. Then, the function loads the json and returns an array of
  records. Define one interface for all of the  content files to use. 