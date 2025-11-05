# page updates

Note: We will collaborate on this document. I will write some of it, anmd at the
end, you will see instruictions for filling in your part. 

## Page Renaming

1) [DONE] list all of the pages in /src/pages that are leaves and are named
   `index.astro`. FOr instance, `about/contact/index.astro`, since there are no
   child pages of `/about/contact`. List all of these pages below. 

   - `src/pages/donate/supporters/index.astro`
   - `src/pages/donate/create-a-fundraiser/index.astro`
   - `src/pages/donate/the-league-at-work/index.astro`
   - `src/pages/donate/volunteer/index.astro`
   - `src/pages/about/policies/enroll/index.astro`
   - `src/pages/about/policies/privacy-policy/index.astro`
   - `src/pages/about/policies/nondiscrimination-policy/index.astro`
   - `src/pages/about/policies/covid-policy/index.astro`
   - `src/pages/about/locations/index.astro`
   - `src/pages/camps/summer-2025/index.astro`
   - `src/pages/camps/summer-camp/index.astro`
   - `src/pages/camps/summer-camps-2024/index.astro`
   - `src/pages/programs/classes/python/index.astro`
   - `src/pages/programs/classes/python-vs-java/index.astro`
   - `src/pages/programs/classes/java/index.astro`
   - `src/pages/programs/tech-club/programming-merit-badge/index.astro`
   - `src/pages/programs/tech-club/code-clinic/index.astro`
   - `src/pages/programs/tech-club/robot-garage/index.astro`

2) [DONE] Convert all of these pages to have page names instead of directory
   names. That is, the new name of a page that is in the directory
   `foo/index.astro` will be `foo.astro`. Rename, but do not delete directories
   yet. For this task, do not delete each file seperately. Write a Bash script
   in test/dev to delete all of them, and then add the ref to that script in
   the document 10_renaming.md. Do not run the script yet. Renaming handled by
   `test/dev/rename_leaf_pages.sh`; cleanup script scaffolded at
   `test/dev/delete_empty_page_dirs.sh` and not executed.

3) I'd like to continue steps (1) and (2) for all of the remaining index.astro
   files, but this time you will not be deleteing any directories, you are just
   moving files. That is, for instance, you will move
   'pages/programs/index.astro' to 'pages/programs.astro' and leave the
   'programs/ directory alone. You will have to edit the imports on the pages to
   get the right paths. Complete this task by first creating a script in
   `test/dev/` to move all of the files, then let me review and run the program.
   After that, you will edit the files to fix the paths. Script ready at
   `test/dev/move_remaining_index_pages.py` and run; updated relative imports for
   the moved top-level pages (`about.astro`, `about/policies.astro`, `camps.astro`,
   `donate.astro`, `programs.astro`, `programs/classes.astro`, `programs/tech-club.astro`)
   plus their leaf descendants to ensure `npm run astro check` passes.