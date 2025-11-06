# Data

- Move data into .astro files. 

Here is a list of the file that are importing data: 

```
$ find src/pages -type f -exec  grep -H "import.*from[[:space:]]*['\"].*/data/" {} \;
src/pages/donate/supporters/index.astro:import { supportersHero, supporterTiers, gratitudeHighlights } from '../../../data/donate';
src/pages/donate/index.astro:import { siteSettings } from '../../data/siteSettings';
src/pages/donate/create-a-fundraiser/index.astro:import { fundraiserHero, fundraiserIdeas, fundraiserSteps, fundraiserSupport } from '../../../data/donate';
src/pages/donate/the-league-at-work/index.astro:import { leagueAtWorkHero, leagueAtWorkHighlights, leagueAtWorkProcess } from '../../../data/donate';
src/pages/donate/volunteer/index.astro:import { volunteerHero, volunteerRoles, volunteerSteps, volunteerFaq } from '../../../data/donate';
src/pages/about/contact/index.astro:import { siteSettings, socialLinks } from '../../../data/siteSettings';
src/pages/about/contact/index.astro:import { mainNavigation } from '../../../data/navigation';
src/pages/about/locations/index.astro:import { mainCampus, satelliteLocations } from '../../../data/locations';
src/pages/camps/summer-2025/index.astro:import { campTracks, campResources, campContact } from '../../../data/codingCamps';
src/pages/camps/summer-camp/index.astro:import { campResources, campContact } from '../../../data/codingCamps';
src/pages/camps/summer-camp/index.astro:import { summer2024Hero, featuredCamps, campTips, partnershipHighlight } from '../../../data/summer2024';
src/pages/camps/summer-camps-2024/index.astro:import { campResources, campContact } from '../../../data/codingCamps';
src/pages/camps/summer-camps-2024/index.astro:import { summer2024Hero, featuredCamps, campTips, partnershipHighlight } from '../../../data/summer2024';
src/pages/programs/tech-club/programming-merit-badge/index.astro:import { meetupLinks, contactInfo } from '../../../../data/techClub';
src/pages/programs/tech-club/code-clinic/index.astro:import { meetupLinks } from '../../../../data/techClub';
src/pages/programs/tech-club/index.astro:import { techClubHero, techClubPrograms, techClubTopics, meetupLinks, contactInfo } from '../../../data/techClub';
src/pages/programs/tech-club/robot-garage/index.astro:import { meetupLinks } from '../../../../data/techClub';```

All of this data should be moved into the `.astro` file. Much of the data is completely 
uncessary to store in a seperate data store; these items should be moved into the 
HTML directly, with no intermediate variable. THe only things that should be kept in 
data structures are where there is a collection with more than 3 items. If there is only 
three items, fully unroll the loop into hard-coded HTML. If it is more, then move the 
data into the page frontmatter, with one seperate variable per collection. 




