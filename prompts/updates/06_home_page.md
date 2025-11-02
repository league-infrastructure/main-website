# Home Page Updates

This report summarizes the differences and required fixes between the
two versions of the website based on the latest review.

## 1. Header Navigation Menu

-   [DONE] The site header navigation list menu must have a **thin gray
    border** at both the **top and bottom**.
-   [DONE] The border should extend the **full width (100%)** of the header.


## 2. Section Background Fades

-   [DONE] The **fade properties** for all sections are **missing or
    incorrect**.
-   [DONE] Each section component must use the props:
    -   `StartBackgroundColor`
    -   `EndBackgroundColor`

### Correct Fade Sequence

  Section                      Start Background   End Background
  ---------------------------- ------------------ ----------------
  Hero                         White              Orange
  Weekly Programming Classes   Orange             Orange
  Free Classes                 Orange             Orange
  Other Programs               Orange             White

> **Note:** [DONE] "Preparing Youth for Careers" currently uses the wrong
> background and fade settings --- it should match the rules above.


## 3. "Preparing Youth for Careers" Layout

-   [DONE] The **image (Girl Scouts)** should **float left**.
-   [DONE] To the **right of the image**, position:
    -   The **"Preparing Youth for Careers"** text
    -   The **corporate logos**
-   [DONE] Layout ratio should approximate **2/5 for the image** and **3/5 for
    the text/logos**.


## 4. "Hear from Our Community" Section

-   [DONE] The **title text** should be:
    -   Centered
    -   Larger (Level 1 heading)
-   [DONE] The **video** follows directly below the heading.
-   [DONE] The **testimonials** appear **below the video**.
-   [DONE] **Remove** the "Voices from the League" subsection entirely.
-   [DONE] The section background should be **orange**.


## 5. "Get Started" Call to Action

-   [DONE] The current layout is incorrect and too small.
-   [DONE] The section should be approximately **400px high**, with ample
    spacing above and below.
-   [DONE] In the **center**, place:
    -   The **"Get Started"** title
    -   Two centered buttons: **"View Our Programs"** and **"Join
        Now"**, stacked below the title.
-   [DONE] The section background should be **orange**, with **no white space**
    between this orange section and the footer.


## Summary of Key Fixes

1.  [DONE] Add 100% width top and bottom gray borders to the header.
2.  [DONE] Correct all section fades using proper start and end background
    colors.
3.  [DONE] Adjust "Preparing Youth for Careers" to a left-image, right-text
    layout.
4.  [DONE] Center and restyle "Here from Our Community," removing extra
    subsections.
5.  [DONE] Redesign the "Get Started" call to action to be full-height,
    centered, and visually bold.


# 6 Misc 

[DONE] In the weekly programming classes at the very bottom of the footer, you've got
the buttons and the links mixed up. The enroll in person and enroll line links
are supposed to be buttons. They have white text in an orange background. The
learn more is a link. It's an orange link. Use the orange color that I just told
you about earlier which is the one in the getting started CTA.

