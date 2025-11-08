# Scrape and convert Posts

We need to scrape https://www.jointheleague.org/news/ to get new versions of the posts. 

- [DONE] First, scrape the news page  https://www.jointheleague.org/news/  to get the
  articles and their featured images. Put this data into a JSON file in
  /data/news.json. To do this, you will write a program that uses python
  requests to get the page, and beautiful soup to process it. Put the program in
  `test/devel`. You can save the scraped page to /scrape/news to store it to
  analyze it in more detail, but your proggram should be able to create all of
  the required output. You should run the program and check the output until you
  are satisfied that it captures: the article url, the featured image url, and
  the title of the article. 

- [DONE] Using the  `data/news.json` file, write a program to scrape all of the news
  pages to `scrape/news`. Put the scraped pages into files named for a slug of
  the path of the url, not a heirarchical path that mirrors the url path. 

- [DONE] Write a program to clean the pages in `scrape/news` of anything that is not
  important to understanding the content. Mostly you will get rid of any classes
  for "fusion" but you should retain ( or create your own version of ) classes
  that are important for understanding the structure of the files. However, for
  the most part, the news articles should just be plain HTML. 

- [DONE] Create a `Post` component that will hold the body content of a block post. It
  should have slots/props for a features image, an author, and the post date. 

- [DONE] Ok your post download program works, so let's change it. We do actually need
  to use the date in the path, just like wordpress. You can extract the date
  from the download path. Also, extract the body content, and put the content
  into a page in `.astro` format using the `Post` component. 

- [DONE] Create a page for the /news/ section that lists all of the news
  articles in reverse chron order and links to the page for each article. Verify
  that it works with the devel server on prot :4321 and browsermcp or puppeter. 

- [DONE] I've moved all of the posts from /src/pages/news to /src/content/posts.
  Convert all of them to .md files in the form expects by the Astro collections
  system. Move the current `post` data to the md frontmatter. 


- Now we have to copy over the images. Write a program to visit all of the posts
  and extract the image urls. Download the image and put it into the same
  directory as the post, then change the url to reference the image correctly.
  Get rid of the srcsets and just use the primary size images, scaled with css
  appropriately. Remove all unecessary attributes for the img tags, and conver to
  markdownformat images where you can do so safely. If you need to apply styles, 