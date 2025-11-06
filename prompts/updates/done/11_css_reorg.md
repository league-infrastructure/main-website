# CSS Reorganization

There is still alot of CSS that seems to be in the wrong places, in site.css and
global.css. 

[DONE] Component-specific selectors have been relocated to their respective components:
- Base card styles (`.card`, `.card__eyebrow`, `.card__title`, `.card__body`, `.card__footer`, `.card__price`) now live in `src/components/CardBaseStyles.astro`, loaded via `BaseLayout.astro`.
- `SectionHeader` styles previously in global/site CSS now reside within `src/components/SectionHeader.astro`.

1) [DONE] Analyze `site.css` and `global.css` and identify selector prefixes ( like
    `card__`) that belong to Component. Then, update this item to list the
    selectors ( the whole selector ) along with the component it should be
    associated with. If you can't find a Component that uses the styles, delete them. 

    `src/components/CardBaseStyles.astro`
    : [DONE] `.card`, `.card__eyebrow`, `.card__title`, `.card__body`, `.card__footer`, `.card__price`, `.card__cta`, `.card__list`, `.card--grid`, `.card--compact`, `.try-card`, `.try-card__body`

    `src/components/CalloutCard.astro`
    : [DONE] Scoped styles only; shared modifiers now sourced from `CardBaseStyles.astro`

    `src/components/SectionHeader.astro`
    : [DONE] `.section__header`, `.section__header--left`, `.section__eyebrow`, `.section__title`, `.section__description`

    `src/components/HeroSection.astro`
    : [DONE] `.hero-section__container`, `.hero-section__layout`, `.hero-section__layout--split`, `.hero-section__content`, `.hero-section__description`, `.hero-section__note`, `.hero-section__status`, `.hero-section__details`, `.hero-section__actions`, `.hero-section__media`, `.hero-section__aside`, `.hero-section__aside-list`

    `src/components/Header.astro`
    : [DONE] `.site-header__top`, `.site-header__top-inner`, `.site-header__tagline`, `.site-header__utility-list`, `.site-header__utility-list a`, `.site-header__utility-list a:hover`, `.utility-icon`, `.site-header__main`, `.site-header__logo`, `.site-header__logo img`, `.site-header__nav`, `.site-header__nav-list`, `.site-header__nav-list a`, `.site-header__actions`

    `src/components/Footer.astro`
    : [DONE] `.footer`, `.footer__grid`, `.footer__heading`, `.footer address`, `.footer__links`, `.footer__links a`, `.footer__links a:hover`, `.footer__bottom`, `.footer__policies`, `.footer__policies a`

    `src/components/ProfileCard.astro`
    : [DONE] `.profile`, `.profile--surface`, `.profile__image`, `.profile__image img`, `.profile__body`, `.profile h3`, `.profile p`, `.profile__meta`, `.profile__meta a`

    `src/components/EmbedLoader.astro`
    : [DONE] `.embed-loader`, `.embed-loader__loading`, `.embed-loader__error`, `.embed-loader__loading p`, `.embed-loader__error p`

    `src/components/PikeWidget.astro`
    : [DONE] `.pike-widget`

    `src/pages/about/policies/{covid-policy,nondiscrimination-policy,privacy-policy}.astro`
    : [DONE] `.policy-hero__content`, `.policy-intro`, `.policy-checklist`, `.policy-checklist__card`, `.policy-checklist__card ul`, `.policy-toc`, `.policy-toc__list`, `.policy-toc__list a`, `.policy-toc__list a:hover`, `.policy-toc__list a:focus`, `.policy-detail__inner`, `.policy-detail__content`, `.policy-detail__content ul`, `.policy-detail__content ol`, `.policy-detail__content a`, `.policy-detail__content a:hover`, `.policy-detail__content a:focus`

    `src/pages/about/policies.astro`
    : [DONE] `.policy-links`, `.policy-section`, `.policy-section h2`, `.policy-section__content`, `.policy-section__actions`, `.policy-note`

    `src/pages/about/impact.astro`
    : [DONE] `.impact-report`, `.impact-report__header`, `.impact-report__embed`, `.impact-report__embed iframe`, `.impact-links`, `.impact-links__list`

    `src/pages/about/locations.astro`
    : [DONE] `.locations__feature`, `.locations__note`, `.locations__grid`, `.locations__links`

    `src/pages/programs/*` (hero layouts)
    : [DONE] `.hero`, `.hero__grid`, `.hero__grid--compact`, `.hero__grid--cozy`, `.hero__content`, `.hero__actions`, `.hero__aside`, `.hero__aside:not(.card)`, `.hero__list`, `.hero__media`, `.hero__media img` (now centralized in `src/components/HeroLayoutStyles.astro`)

    `src/pages/programs/**` (try card callouts)
    : [DONE] `.try-card`, `.try-card__body` (shared layout provided by `CardBaseStyles.astro`)

    `src/pages/programs/classes/{python,java,python-vs-java}.astro`
    : [DONE] `.map-card`, `.map-card iframe` (intentionally retained in `src/styles/site.css`)

    `src/pages/programs.astro`
    : [DONE] `.table-wrapper`

    `src/pages/donate*.astro`
    : [DONE] `.donation-widget`, `.donation-widget__grid`, `.donation-widget__embed`, `.donation-widget__note`, `.donation-impact__grid`, `.donation-methods__grid`, `.gratitude-grid`, `.volunteer-grid`, `.supporter-grid`, `.fundraiser-grid`, `.fundraiser-support`, `.donation-impact__card p`, `.gratitude-grid p`, `.fundraiser-grid p`, `.fundraiser-support p`, `.donation-methods__grid .card`, `.donation-methods__grid .card__cta`, `.steps-list`, `.steps-list li`, `.steps-list li::before`, `.faq-grid`, `.process-grid`, `.process-grid__item`, `.process-grid__step`, `.volunteer-cta`

    `src/pages/about/policies/enroll.astro`
    : [DONE] `.content`, `.plan-grid`, `.subsection`, `.subsection ol`, `.content a`, `.content a:hover`, `.content a:focus`

    `src/pages/about.astro`
    : [DONE] `.about-hero`, `.about-hero__inner`, `.about-hero__content`, `.about-hero h1`, `.about-hero .lead`, `.about-hero__media`, `.about-hero__blob`, `.about-hero__media img`

    `src/pages/about.astro` (staff/board grids)
    : [DONE] `.profiles` (scoped within the page)

    Delete
    : [DONE] `.locations`

    Delete
    : [DONE] `.impact`, `.impact__grid`, `.impact__card h3`, `.impact__card p`

    Delete
    : [DONE] `.mission`, `.mission__inner`, `.mission p`

