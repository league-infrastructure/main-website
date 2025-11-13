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


- [DONE] Update the programs page to split the Programs section into two sections : "Weekly
  Classes" which displays the programs in the `group-classes` category, and the
  "Community Programs" which displays the programs in the `community-tech`
  category. For each section, use the title for the category ( matched by slug )
  from the categories data. 
