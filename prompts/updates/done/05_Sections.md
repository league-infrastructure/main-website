# Sections

- [DONE] THe About page still has:

```
  <AboutHero />
  <MissionStatement />
  <ImpactHighlights />
  <TeamGrid />
  <BoardGrid />
```

These should all be expanded by moving the code from the referred component into the About page.

- [DONE] We have a lot of code like this: 

  <section class="section section--surface-alt" id="weekly-camps">
    <div class="container">
    ...
    </div>
</div> 

and I'd like to compress it to something that uses `<Section>` You should add some extra attributes for things
like 'id'. 

- [DONE] For the programs page, move all of the data that is not part of iteration, like the Hero Section, 
out of the _index.yaml file and into the page. The lists of programs should remain defined by data. 

- [DONE] Move the lists of data for the About page out of the `_index.yaml` file back
into the frontmatter of the page as type script data structures. Use one data
structure for "Main programs" and one for "Other ways to learn". FOr the "Main
Programs" there is just one data structure that holds the programs for both the
cards and the table, so add a value `display_in` that is a list that can have 0,
1 or 2 of the strings {`card`, `table`} to determine where to display the
program. 

- [DONE] We have two hero components, src/components/ui/Hero.astro,
  src/components/ui/HeroSection.astro are these different? If not,  consolidate them. 

- [DONE] Review all of the pages that have a Hero section that is implemented directly
with divs and use the Hero components, if possible. 

- [DONE] Why do we have a components/ui directory? Move all of the components in this
  dir to the main /src/components/ dir
