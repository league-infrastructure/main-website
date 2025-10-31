# Analyze the website for display features. 

Review the pages in `scrape/`, exclusing `scrape/posts` to understand the page structure. 

The goal of the analysis is to determine what  React or Next.js components we will need. We will probably need things like:

* a product comparison table
* a list of staff members with headshots. 
* Two column blocks, 13+2/3 or 2/5+3/5, with text on one side and an image on the other
* Three column product descriptions, where each 1/3 has an image, a title a text and a "Learn More" link
* etc. 

At first, I'd like to basically duplicate the existing site, with style, images and colors. 

We will be using Astro to build the site, probably with a basic theme like https://github.com/creativetimofficial/astro-launch-ui, but we might create a completely custom theme. 

# Special Attention Pages

Here are some pages that require special attention: 

* https://www.jointheleague.org/programs/
* https://www.jointheleague.org/about/

These pages have muiltple section, with tables and graphic seperators that we'd like to repilicate

# Output

Process: 

* Review the Special Attention Pages and a selection of other pages
* Review the stored pages.txt, but then also fetch the HTML from the live site to get style information. 

You are particularly looking for what components we will need to have in the
theme we build in Astro such as "Comparison Table" or "Product Description" or
"Staff Member"

To get HTML pages, you can construct a URL to the site from the path to the stored page.txt file. For instance,
the page `scrape/programs/coding-camps/summer-2025/page.txt` can be fetched from 
`https://www.jointheleague.org/camps/summer-2025/`

Also document anything else that you think will be important in rebuilding our site in Astro. 

Document your findings in `docs/analysis.md`

# Updates

1) Analyze what data collections we need and and the list of them to the
`analysis.md` file. Include in your analysis the data fields that each
collection will need. For instace the product comparison table will need
"Level", "Duration", "Price", etc, and the staff entries will nee name, picture
and blub. 

2) Inventory media assets to determine and classify them in to categories, such
as 'logo', 'blog image',  "icon", or "page image"

3) For each major component, provide a deeper description of what properties it
should have, including sub-content, sub-components and style. 

4) Review all of the pages and develop a list of the types of pages we have. For
and a "Program Page". What are all of them that will need a special type? Note
instance, there is a "Home Page" of course, but also "About" a "Program List"
that many types of pages will not need a special type, and can use some moreA
general template. 

5) Extract menus. We have several menus: one at the very top of the page (
   phone, email and client portal ) one in the header, and one in the footer.
   Extract the names of the pages that these menus point to. 

6) Extract all of the identified content collections into JSON files. Create a data directory to put them into. 