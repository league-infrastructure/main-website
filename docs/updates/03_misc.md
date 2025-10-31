
# Misc Updates

- [DONE] In coding-programs/classes/python-vs-java, the images in the cards in "CHoose
YOur Path" should be full-width of the card, the same width as the button. These
imagges are too small

- [DONE] On the About, in the Our Mission section, make the background peach. 

- [DONE] Then, on the About, the section after Our Mission, Impact Highlights, fade from peach to white. 

- [DONE] On the about page, in the Staff section, give the staff cards a peach color with the white background of the section. Then the board section has the opposite, white cards with a peach background. 

- [DONE] Remove "Tuition Assistance " from the home page and the about page. 

- [DONE] Re-write the URLs for '/coding-programs/' to '/programs/' and '/coding-camps/' to '/camps/'

- [DONE] in Program page  under "More Ways to Yearn", the cards should have a contrasting color. 

- [DONE] Add Fades to the Program Page:
  * [DONE] Hero: Bluish to Peach:
  * [DONE] Main Program: Peach to White. 
  * [DONE] COmpare our Program: white, but make alternating rows peach. 
  * [DONE] More Ways to Learn: white to peach
  * [DONE] Try a class: Peach. 

- [DONE] Get rid of the lozenge-shapped area that has the page title in it on many pages, 
like this one: <div class="about-hero__content"> <span class="tag">About</span> ...  </div>

- [DONE] Convert all of the  posts. For the posts, I'd really like to have the source
.astro file be as minimal markdown as possible, so create just one template for
the posts. Front matter should have data for the date, maybe a title ( if not
the first # heading ) and a link to the featuired image. Put the posts in to
src/posts. Use the same permalinks the wordpress site : /year/month/day. 

- [DONE] Make image map. Create a YAML file in docs, docs/images.yaml, that maps from each
  of the image URLs in the src/pages/ and  src/posts directorys. The .yaml
  mapping has the original URL as a key and the URL in this site as the value.
  The image maps are each children of  ( the value of) a key for thepage that
  has the image. 

  So, you are going to go through all of the pages and posts, and create a key
  in image.yaml for each file, which has a dict of the original URL of the image
  in the old site and the new URl in this site. 

- [DONE] From images.yaml create bin/move_images.py that uses the image map to move the
  images to the new localtion ( from scrape/wp-content/uploads ) to the new
  location in this sie ( in src/public? not sure ) Dont run the program yet, but
  you can add a --dry-run command to veryify that the program works. Use click
  for program args and options, its already installed.  
