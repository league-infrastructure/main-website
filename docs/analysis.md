# Site Component Analysis

## Brand & Layout System
- **Palette**: primary orange `#f37121`, secondary indigo `#5d5fef`, and supportive pastels (`#fff2e8`, `#e6f5f7`) appear across hero gradients, comparison tables, and CTA bands; neutral white cards sit on lightly tinted backgrounds.
- **Typography**: Avada pulls in Inter and the theme default sans-serif; headings often use the orange accent, body copy in neutral gray; Font Awesome icons reinforce checklists and content boxes.
- **Section rhythm**: most sections apply 44–88px vertical padding, alternating tinted backgrounds, rounded 24–40px cards, and soft drop shadows (rgba(201,201,201,0.25)).
- **Imagery**: frequent left/right image-and-copy blocks, program iconography, partner-logo rows, Vimeo embeds, and photographic galleries with even spacing.

## Core Component Inventory
The site reuses 17 core presentation patterns that inform our Astro component plan. Detailed specifications are documented in **Component Specifications** below.

## Page Highlights
- **Home (`/`)**: Hero with program CTA buttons, program overview cards (global include), "Preparing Youth" feature with logo strip, Vimeo testimonial video, three-column testimonial quotes, photo gallery, and orange CTA footer.
- **Programs (`/programs/`)**: Extensive three-card "Main Programs" grid, secondary "Other Programs" content boxes, detailed comparison table, repeated checklist cards for each offering, dual "Why Python/Java" content columns, more callouts to Tech Club/Java/Python, and global CTA sections. Heavy reuse of orange/indigo palette and iconography.
- **About (`/about/`)**: Gradient hero, mission statement with background image overlay, two sequential lottie-enhanced text blocks, large staff directory (9+ cards), board roster cards in wrapped grid, plus global CTA/footer inserts.
- **Donate (`/donate/`)**: Embedded Give Lively widget above fold, supportive impact bullet list, split layout with imagery, FAQ accordion, and icon-based content boxes for alternative giving methods (PayPal, Venmo, Text).
- **News (`/news/`)**: Post slider hero followed by masonry-ish three-column blog grid with load-more/infinite scroll.
- **Client Portal & Modals**: Smaller pages rely on simple text and global CTA elements; modal shortcodes indicate we should accommodate lightbox links/popups if we port them.

## Data & Content Considerations
- Staff, board, and testimonial content should live in structured data (e.g., YAML/JSON collections) to avoid hardcoding long lists in templates.
- Program offerings (Python, Java, Tech Club, Private, Camps) repeat across cards, checklists, and table rows; centralize this data to drive cards, comparison tables, and CTAs consistently.
- FAQ entries, donation methods, and logo assets can be managed as collections for easier updates.
- Lottie animations and icon assets need hosting paths or bundling within the Astro project.

## Content Collections
- **siteSettings**: global brand colors, typography tokens, social links, location info, default CTA copy.
- **navigationMenus**: arrays of menu items with `label`, `href`, `target`, `icon`, `children[]`.
- **programs**: `slug`, `title`, `levelTag`, `audience`, `summary`, `fullDescription`, `cardImage`, `heroImage`, `deliveryModes`, `tuition`, `tuitionFrequency`, `ctaLabel`, `ctaHref`, `ordering`, `tags[]`.
- **programComparisonRows**: `programSlug`, `displayName`, `level`, `duration`, `tuition`, `tuitionAssistance` (bool + note), `schedule`, `studentTeacherRatio`, `languages`, `additionalNotes`.
- **programChecklists**: `programSlug`, `heading`, `items[]` where each item holds `icon`, `label`, `description`.
- **testimonials**: `id`, `quote`, `speakerName`, `speakerRole`, `speakerType` (student, parent, partner), `image`, `weight`, `featured`.
- **faqEntries**: `category` (donations, programs, etc.), `question`, `answerHtml`, `relatedLinks[]`.
- **staffMembers**: `id`, `name`, `role`, `bio`, `email`, `phone`, `headshot`, `priority`, `socialLinks{platform:url}`.
- **boardMembers**: same fields as `staffMembers` plus `affiliation`, `position`, `termInfo`.
- **partnerLogos**: `name`, `logo`, `alt`, `url`, `role` (employer, sponsor), `weight`.
- **mediaGalleryItems**: `id`, `category` (classroom, event), `src`, `alt`, `caption`, `attribution`, `order`.
- **donationMethods**: `slug`, `title`, `description`, `icon`, `image`, `ctaLabel`, `ctaHref`, `embedCode` (for Give Lively), `notes`.
- **ctaBlocks**: `slug`, `eyebrow`, `heading`, `body`, `primaryCta{label,href}`, `secondaryCta{label,href}`, `backgroundStyle`, `anchorId`.
- **lottieFeatures**: `slug`, `title`, `body`, `animationSrc`, `fallbackImage`, `backgroundColor`, `cta`.
- **blogPosts**: `slug`, `title`, `excerpt`, `heroImage`, `category`, `tags[]`, `date`, `author`, `readingTime`, `sourceUrl` (WordPress permalink).
- **embeddedVideos**: `slug`, `provider`, `videoId`, `title`, `description`, `poster`, `transcript`.
- **modalDefinitions**: `slug`, `triggerLabel`, `contentHtml`, `cta`, `displayRules`.

## Media Asset Inventory
- **Brand & Logos**: League wordmark (horizontal/orange), favicon, partner/employer logos (Google, Amazon, Microsoft, Sony, Intuit, PlayStation).
- **Program Illustrations**: PNGs such as `programs.png`, `python.png`, `java.png`, `codingcamps.png`, plus Tech Club badges used across cards and checklists.
- **Photography**: Classroom shots (`MX-Library-Workshop`, `Forcepoint-Cybersecurity`), student/instructor imagery (e.g., `johnlaylah.jpg` on Donate page), gallery images for events.
- **People Headshots**: Staff and board portraits (square or circular crops like `EricBusboom.png`, `Christine Dolan.jpg`, `tammy.jpeg`).
- **Icons & UI Sprites**: Font Awesome icons, SVG/PNG checkmarks (`check.png`), crosses (`cross.png`), quote marks (`quote-300x218.png`), Venmo QR PNG, PayPal button image.
- **Backgrounds & Patterns**: Gradient hero backgrounds, mission background `Our_MissionBG.png`, tinted section overlays, subtle drop-shadow assets.
- **Media Embeds**: Vimeo video (`290793328`), Lottie JSON files (`graph.json`, `entry.json`), Give Lively embed script.
- **Documentation & PDFs**: Indirect references via CTAs (Typeform, Pike13) that may require supporting imagery or icons when recreated.

## Third-Party Integrations & Links
- Give Lively widget script (`secure.givelively.org`) renders the primary donation form; ensure Astro supports script injection and optional SSR guards.
- PayPal donation form posts to `paypal.com/donate`; replicate button styling while retaining form behavior.
- Venmo QR and "Text to give" instructions rely on static assets and copy—component should support image and rich text.
- Typeform (`jointheleague.typeform.com/to/winxxt`) and Pike13 scheduling links appear in CTAs; design buttons/cards to accommodate external links with tracking parameters.
- Vimeo video embed and Font Awesome icons require either CDN usage or local asset strategy in Astro.

## Component Specifications
- **HeroBanner**
	- **Purpose**: Present the key value proposition with adjacent media.
	- **Key Props**: `eyebrowLogo`, `heading`, `body`, `primaryCta`, `secondaryCta`, `mediaType` (image/video), `backgroundStyle`, `anchorId`.
	- **Sub-content**: Optional logo strip, stat badges, or scroll cue.
	- **Style Notes**: Supports gradients or solid tints, left/right layout, 44–88px padding, responsive stacking with media below on mobile.
- **FeatureSplit**
	- **Purpose**: Reusable two-column section for narratives like "Preparing Youth" or mission statements.
	- **Key Props**: `heading`, `body`, `media`, `mediaPosition`, `backgroundColor`, `overline`, `cta`, `alignment`, `spacing`.
	- **Sub-content**: Supports bullet lists, checklist, or lottie embed slot.
	- **Style Notes**: Large media radius, optional drop shadow, handles alternating backgrounds.
- **ProgramCardGrid**
	- **Purpose**: Showcase main programs in a three-column layout.
	- **Key Props**: `cards[]` where each card holds `title`, `levelTag`, `summary`, `image`, `cta`, `flag` (e.g., Beginner).
	- **Sub-content**: Inline list of highlights or badges; optional price snippet.
	- **Style Notes**: 40px border radius, box shadow, hover translate, card spacing consistent with Avada grid.
- **ContentBoxGrid**
	- **Purpose**: Render icon-driven boxes for donation methods or ancillary programs.
	- **Key Props**: `columns`, `items[]` with `icon`, `title`, `html`, `cta`, `background`.
	- **Sub-content**: Form embeds (PayPal), QR images, subheadings.
	- **Style Notes**: Accepts accent color overrides, supports equal height alignment.
- **ComparisonTable**
	- **Purpose**: Compare offerings via structured data (levels, tuition). 
	- **Key Props**: `columns[]`, `rows[]`, `mobileVariant` (accordion/stack), `iconMap` for check/cross.
	- **Sub-content**: Footnotes, inline images, CTA rows.
	- **Style Notes**: Alternating row colors, sticky first column optional, responsive reflow at breakpoints.
- **ChecklistCard**
	- **Purpose**: Highlight benefits with icon-labeled list (e.g., Tech Club details).
	- **Key Props**: `title`, `items[]` (`icon`, `label`, `description`), `accentColor`, `cta`.
	- **Sub-content**: Supporting paragraph, badge chips.
	- **Style Notes**: Box shadow, rounded edges, Font Awesome icon support.
- **FAQAccordion**
	- **Purpose**: Collapsible FAQ set with donation answers.
	- **Key Props**: `items[]` (`question`, `answerHtml`), `accentColor`, `iconSet`, `initialOpen`.
	- **Sub-content**: Rich HTML links, contact CTA row.
	- **Style Notes**: Bold headers in orange, content in neutral gray, smooth animation.
- **Testimonials**
	- **Purpose**: Display quotes with attribution.
	- **Key Props**: `layout` (grid/carousel), `items[]` (`quote`, `name`, `role`, `image`), `accentColor`, `quoteGraphic` toggle.
	- **Sub-content**: Buttons for navigation, rating stars optional.
	- **Style Notes**: Soft pastel background, card radius ~24px, consistent padding.
- **VideoSection**
	- **Purpose**: Embed Vimeo or YouTube content with framing copy.
	- **Key Props**: `heading`, `body`, `video` (`provider`, `id`, `poster`), `backgroundColor`, `maxWidth`.
	- **Sub-content**: Transcript toggle, caption text.
	- **Style Notes**: 16:9 responsive wrapper, top/bottom separators for spacing.
- **LogoStrip**
	- **Purpose**: Present partner/employer logos as social proof.
	- **Key Props**: `logos[]` (`name`, `src`, `alt`, `url`), `layout` (grid/marquee), `title`, `background`.
	- **Sub-content**: Optional copy block describing partnerships.
	- **Style Notes**: Even spacing, grayscale hover, accessible alt text.
- **MediaGallery**
	- **Purpose**: Showcase event imagery in 3-up layout.
	- **Key Props**: `items[]` (`src`, `alt`, `caption`), `lightbox` bool, `columns`, `backgroundColor`.
	- **Sub-content**: "View all" CTA, description text.
	- **Style Notes**: Hard max-width ~300px per item, responsive wrap.
- **CTABand**
	- **Purpose**: Drive conversions with high-contrast band.
	- **Key Props**: `heading`, `body`, `primaryCta`, `secondaryCta`, `backgroundStyle`, `icon`.
	- **Sub-content**: Optional eyebrow and legal note.
	- **Style Notes**: Full-bleed color (#f37121), centered typography, button group spacing.
- **PersonGrid**
	- **Purpose**: List staff or board members with contact info.
	- **Key Props**: `people[]` (`name`, `role`, `image`, `bio`, `email`, `socialLinks`), `columns`, `variant` (staff/board).
	- **Sub-content**: Section intro, filters by department.
	- **Style Notes**: Card radius 24px, drop shadow, circular or rounded headshots.
- **LottieFeature**
	- **Purpose**: Pair narrative copy with animated lottie asset.
	- **Key Props**: `title`, `body`, `animationSrc`, `fallbackImage`, `backgroundColor`, `cta`.
	- **Sub-content**: Inline stat list or bullet points.
	- **Style Notes**: Balanced spacing to prevent layout shift, ability to disable animation for performance.
- **DonationWidget**
	- **Purpose**: Embed Give Lively widget and alternative donation options.
	- **Key Props**: `embedCode`, `title`, `body`, `giveLivelyConfig`, `methods[]` (links to Venmo, PayPal), `backgroundColor`.
	- **Sub-content**: FAQ link, compliance copy.
	- **Style Notes**: Tinted background (#e6f5f7), ensures embed width fluid.
- **BlogGrid**
	- **Purpose**: Surface news posts with infinite scroll or pagination.
	- **Key Props**: `posts[]` (`title`, `excerpt`, `image`, `date`, `author`, `href`), `layout` (grid/list), `paginate`, `loadMoreLabel`.
	- **Sub-content**: Featured post slider, category filter.
	- **Style Notes**: Three-column grid large screens, card drop shadow, meta text styled in uppercase gray.
- **GlobalPartials**
	- **Purpose**: Shared sections like footers, back-to-top buttons, sticky CTAs.
	- **Key Props**: `slotContent`, `trigger`, `background`, `anchorId`.
	- **Sub-content**: Modal definitions, newsletter sign-up.
	- **Style Notes**: Match Avada spacing, ensure reusable tokens for typography and color.

## Implementation Notes & Risks
- The Avada comparison table and checklist cards rely on decorative icons/images for checkmarks/crosses; plan accessible alternatives (aria labels, text) when rebuilding.
- Many backgrounds use gradients or patterned PNG overlays; catalog these assets from `/wp-content/uploads/` for reuse.
- Lottie animations and testimonials currently load via external URLs—confirm licensing and download local copies if preferred.
- Give Lively embed may require client-side only rendering; ensure hydration or `client:load` strategy does not block static build.
- Mobile behavior is not visible in stored markup; verify responsive breakpoints when recreating components, especially for the comparison table and multi-column staff grids.

## Suggested Next Steps
1. Extract structured data (staff, board, programs, testimonials, FAQs) into JSON/YAML files for Astro collections.
2. Begin component design system in Astro Launch UI, mapping each recommended component to the visual style documented above.
3. Audit remaining pages in `scrape/pages/` to confirm no additional unique components are missing (e.g., contact forms, modals).
4. Inventory media assets (logos, photography, lottie JSON) and plan a migration path from current WordPress uploads.
5. Prototype the comparison table and donation widget integrations early—they present the highest layout and integration risk.

## Page Template Types
- **Homepage**: marketing-focused landing page combining hero, program highlights, testimonials, media gallery, CTA band, and global footer partials; pulls data from multiple collections.
- **Program Category**: showcases multiple programs within a portfolio (e.g., `/programs/`) using hero, program card grids, comparison tables, checklists, and related content boxes.
- **Program Detail**: individual program microsite (e.g., `/programs/classes/python/`) featuring hero, program specifics, schedule, tuition, testimonials, and CTAs.
- **Mission/About**: storytelling page (e.g., `/about/`) with hero, mission statements, lottie features, staff and board directories, and supporting CTAs.
- **Donate/Support**: conversion-oriented layout combining embed widgets, impact lists, FAQ accordion, alternative donation methods, and assurance content.
- **News/Blog Index**: card grid of posts with optional featured slider, category filters, and infinite scroll or pagination.
- **Blog Post**: single-article template with hero image, metadata, rich content, share links, related posts, and newsletter CTA.
- **Utility/Portal**: compact informational pages (e.g., client portal) relying on text blocks, embedded forms, and CTA partials.
- **Modal/Popup**: reusable overlay content triggered globally (newsletter, alerts) implemented via Astro partials with structured modal definitions.

## Navigation Menus
- **Top Utility Bar**
	- `(858) 284-0481` → `tel:18582840481`
	- `Location & Contact` → `/locations`
	- `Client Portal` → `https://www.jointheleague.org/client-portal/`
- **Primary Header Menu**
	- `About` → `/about/`
	- `Programs` → `/programs/`
	- `Curriculum` → `https://curriculum.jointheleague.org/`
	- `News` → `/news/`
	- `Policies` → `/about/policies/`
	- `Supporters` → `/donate/supporters/`
	- CTA: `Donate` → `/donate`
	- CTA: `Volunteer` → `/volunteer`
- **Footer Links**
	- `Subscribe` form posts to `/about/`
	- Contact: `(858) 284-0481` → `tel:18582840481`
	- Contact: `info@jointheleague.org` → `mailto:info@jointheleague.org`
	- Contact: `Location & Contact` → `/locations`
	- Social: `Facebook` → `https://www.facebook.com/LeagueOfAmazingProgrammers`
	- Social: `Twitter` → `https://twitter.com/LEAGUEofAmazing`
	- Social: `Instagram` → `https://www.instagram.com/theleagueofamazingprogrammers/`
	- Social: `YouTube` → `https://www.youtube.com/channel/UCkUULukaHTW8ljTXKXXGE5A`
	- Social: `LinkedIn` → `https://www.linkedin.com/company/the-league-of-amazing-programmers`
	- Policy: `Nondiscrimination Policy` → `/nondiscrimination-policy/`
	- Policy: `Privacy Policy` → `/privacy-policy/`
	- Policy: `Safe Reopening Plan` → `/wp-content/uploads/2021/11/LOAP_SafeReopeningPlan.pdf`

## Update 6: Program Data Extracts
- **Structured files added**: `data/programs.json`, `data/programComparisonRows.json`, and `data/programChecklists.json` capture the primary program offerings identified in Update 4.
- **Coverage**: Python, Java, Tech Club, Private Classes, and Seasonal Coding Camps now include shared fields for cards, comparison tables, and checklist/mobile variants.
- **Source notes**: Tuition and schedule values come from the comparison table; checklist pricing retains on-page copy (even when amounts differ) so we can reconcile with stakeholders later.
- **Additional extracts**: Added `data/staffMembers.json` (10 staff profiles with contact metadata) and `data/boardMembers.json` (6 directors with roles and affiliations) pulled from `/scrape/live/about/index.html` person grids.
- **Next extraction targets**: Testimonials, FAQs, and donation methods remain to be exported into the remaining collections.
