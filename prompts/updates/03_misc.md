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

- [DONE] There are still a lot of posts and pages that have images from the old
  site in them. Go throußgh all of the posts looking for them. 


- [DONE] Lets rename the images so there are no dates in them. Instead, put them into directories by type: 

  * staff/ staff headshots
  * board/ board headshots
  * docs/ PDF files, like our finanacials. 
  * images/ everything else. 

- [DONE] Move the data used in the home page back into the home page, directly in the
page component attributes. Expand the program cards too. So instead of having a
`const weeklyPrograms` data structure, just put the title and description
directly in the SectionHeader, etc components. This is not about just getting
rid of the destructuring, but about removeing the data structures entirely and
putting the text from the data structures directtly into the page. 

That is, get rid of

```
// Hero content
const heroContent = {
  eyebrow: 'Igniting Young Minds',
  title: 'Igniting Young Minds Through Coding',
  description:
    'At The League of Amazing Programmers, we prepare kids for the science and technology careers of the 21st century through a multi-level program of weekly classes up to industry certification.',
  primaryCta: { label: 'View Our Programs', href: '/programs/' },
  secondaryCta: { label: 'Join Now', href: 'https://jtl.pike13.com/pages/welcome' },
  image: {
    src: '/images/computer-robot-1.png',
    alt: 'Student-built robot with laptop',
  },
};
```

and put that data into 

```
        <div class="custom-hero__right">
          <img src="/images/computer-robot-1.png" alt="Student-built robot with laptop" class="custom-hero__image" />
          <!-- Remove nonprofit badge for now since it doesn't exist -->
        </div>
      </div>
```

- In components with one large text block, such as description in SectionHeader and ProgramCard, make the description the CDATA for the component, and lets the titles be in a title tag,  such as: 

```
      <SectionHeader >
      <h2>Weekly Programming Classes</h2>
      <summary>Our Coding Classes are for students in grades 4-12 who are eager to learn programming. Classes are taught by alumni from Brown University, UCSD, Cornell, and more! We work closely with all students to make coding fun and engaging. All our classes are now available in-person or online – you choose.</summary>
      </SectionHeader>
```

Let's make all of the content elements of ProgramCard into tags, but try to use existing tags where possible, such as: 

```
        <ProgramCard
          <h2>Java Coding Classes</h2>
          <description>For students of all levels who want to learn industry-level Java programming. Our comprehensive 8-level curriculum takes students from basic syntax to advanced object-oriented programming, preparing them for Oracle certification and college-level computer science.<description>
          <ul>
              <li>Oracle-aligned curriculum</li>
              <li>Hybrid and online schedules</li>
              <li>Project-based learning across eight levels</li>
              <li>Industry-standard development tools (Eclipse, IntelliJ)</li>
              <li>Professional certification preparation</li>
              <li>Advanced topics: data structures, algorithms, design patterns</li>
          </ul>
          <price>$280 per Month</price>
          <footer>
          <cta class="primary" href="https://jtl.pike13.com/group_classes/270616">Enroll in Person</cta>
          <cta class="secondary" href="https://jtl.pike13.com/group_classes/270616">Enroll Online</cta>
          <a href="...">Learn More</a>
          </footer>
        </ProgramCard>
```

You can create custom tags where it makes things more clear, like with `<cta>`.

