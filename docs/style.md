# Visual Style Guide

## Brand Foundations
- Bright, youth-focused technology brand that balances playful illustration with credible academic messaging; tone stays encouraging and professional.
- Content sits inside a fixed 1144px column with generous padding (16–24px gutters) and frequent center alignment for headlines and CTAs.
- Sections alternate between white and pastel backdrops and often include anchor
  targets (e.g., `#viewmore`) for smooth-scrolling cues.

## Color Palette
| Role | Hex | Notes |
| --- | --- | --- |
| Primary accent | `#f37121` | Dominant orange used on H1s, primary buttons (Volunteer, Join Now), CTA banners, and icon hovers. |
| Secondary accent | `#5d5fef` | Electric indigo applied to testimonial author lines and occasional links; pair sparingly with the orange. |
| Light gradient stop | `#fcdac5` | Lower stop on the hero gradient (`linear-gradient(180deg, rgba(255,255,255,0) 0%, #fcdac5 100%)`). |
| Section tint | `#fff2e8` | Repeated background for program grids, testimonials, and video band; keeps white cards readable. |
| Dark heading | `#1b1c1d` | Primary headline color for H2–H4 and navigation text. |
| Body text | `#494c4e` | Default paragraph and form label color (`--body_typography-color`). |
| Muted label | `#85888c` | Small labels (H6, table notes) and footer copy. |
| Subtle surface | `#f6f6fa` | Footer widget backdrop and light card surfaces. |
| Divider neutral | `#e2e2e2` | Border color for footers, forms, and content boxes. |
| Base | `#ffffff` | Card fill, text areas, and button default state. |

## Typography
| Style | Token | Size / Line | Weight | Color | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | `--h1` | 48px / 68px | 700 | `#f37121` | Homepage hero and key splash titles. |
| Headline | `--h2` | 36px / 52px | 700 | `#1b1c1d` | Section titles (“Weekly Programming Classes”). |
| Subhead | `--h3` | 30px / 44px | 700 | `#1b1c1d` | Card headers and narrative leads. |
| Feature title | `--h4` | 24px / 36px | 600 | `#1b1c1d` | Content boxes, modal titles, pricing rows. |
| Metric | `--h5` | 25px / 36px | 400 | `#1b1c1d` | Emphasized stats, testimonial headings. |
| Label | `--h6` | 15px / 28px | 400 | `#85888c` | Category tags (“BEGINNER”) and legal text. |
| Body | `--body` | 18px / 32px | 400 | `#494c4e` | Paragraphs, form fields, menu descriptions. |
| Font stack | Inter, Arial, Helvetica, sans-serif | Load via Google Fonts (weights 400–700). |
- Links default to `#494c4e` with hover/active states inheriting the orange accent.
- Button labels are sentence case and stay at 14–18px depending on size (`--button_font_size`).

## Buttons & CTAs
- **Primary**: Solid orange fill (`--button_accent_color:#f37121`) with white hover text; rounded pill silhouette with 18px side padding.
- **Secondary**: Borderless light buttons using dark text (`#1b1c1d`) and orange hover color (utility bar, Donate).
- Icon-prefixed buttons rely on Font Awesome (e.g., phone, map, user) and align left of the label.
- CTA banner (#f37121) in the footer uses inverted white ghost button for the secondary action and outlined orange-on-white button for the primary.

## Layout & Spacing
- Vertical rhythm: heroes use 48px top/bottom padding; major bands repeat 88px stack height; inner card padding averages 4% (≈32–40px).
- Cards (programs, Tech Club, testimonials) share a 40px corner radius and shadow `8px 4px 18px rgba(201,201,201,0.25)`.
- Grid usage: two-up and three-up columns alternate per section, collapsing to single column with 24px vertical gaps on mobile.
- Containers frequently apply `max-width:1144px` with centered rows; imagery often maxes at 300–440px width.

## Imagery & Iconography
- Mix of cartoon-style PNG illustrations (robot laptop, Python snake, Java mug) with real classroom photography; prioritize inclusive, collaborative scenes.
- Partner and accreditation logos appear on neutral backgrounds with consistent padding; keep them monochrome unless brand guidelines require color.
- Quote graphics (`quote-300x218.png`) and Font Awesome glyphs create lightweight ornamentation—maintain the existing assets or recreate vector equivalents.
- Vimeo embeds sit inside rounded, centered frames with ample negative space and separators above/below.

## Section Patterns
- **Hero**: Logo mark stacked over H3 tagline, left text/right illustration, gradient background, and dual CTAs.
- **Program cards**: White cards on peach tint, each with illustration, level tag, short copy, dual enroll buttons, and “Learn More” link.
- **Free Classes**: Mirrored layout to program cards, keeping consistent button treatments and stacked copy.
- **Testimonials**: Three columns with speech-bubble styling, quote graphic, body copy, and indigo author credit.
- **Proof strip**: Employer logos in a flex row with 80px max width and even spacing.
- **Gallery**: Three-up image strip with tight crop and equal max-width (~300px).
- **CTA band**: Full-bleed orange background with centered white typography and two buttons.

## Backgrounds & Effects
- Pastel waves: alternating tinted bands (`#fff2e8`, `#f6f6fa`) break up sections and support scroll-based motion effects.
- Gradient hero overlay `rgba(255,255,255,0) → #fcdac5` softens the top-of-page illustration.
- Rounded masks on illustrations and parallax float configs (`data-motion-effects`) add subtle movement—retain optional on desktop, disable on mobile if performance is a concern.
- Footer area shifts to cool gray (`#f6f6fa`) with stacked logos and newsletter form, ending on a charcoal bar (`#1b1c1d`).

## Forms & Inputs
- Newsletter subscription uses white form on gray field with orange focus border (`--awb-form-focus-border-color:#f37121`).
- Inputs adopt the body font, 18px text size, and `#e2e2e2` borders; maintain generous vertical spacing (8–12px).
- Buttons inside forms mirror secondary button styling with slightly reduced padding.

## Accessibility Notes
- Ensure orange-on-white combinations maintain at least 4.5:1 contrast for body text; use dark text on light peach backgrounds where necessary.
- Provide text alternatives for illustrated PNGs and quote graphics; embed video with captions or transcript.
- Hover color shifts (orange to white) must retain visible border or background to keep the button perceivable.
