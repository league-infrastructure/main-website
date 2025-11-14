# Content specification

The files `programs.md` and `classes.md` are structured Markdown. Each entry describes the content for a program, class or other things. The entries have this format: 


~~~Markdown
# Tech Club

Free introductory classes in Python, Java, robotics, and electronics offered at
schools, libraries and online

Tech Club brings coding education to students who might not otherwise have
access, offering free introductory courses at schools and libraries throughout
San Diego County.

<content> These 60-90 minute sessions introduce students in grades 3-12 to
programming through hands-on projects in Python, Java, robotics, and
electronics. With a less than 10:1 student-to-teacher ratio and no cost to
families, Tech Club removes barriers to computer science education. Many
students who start in Tech Club later transition to our paid weekly classes as
they advance, but Tech Club provides valuable programming experience regardless
of whether students continue. Classes run year-round at various locations.

- Multiple weekly meetups hosted across San Diego County
- Volunteer mentors and alumni support for personalized guidance
- Hands-on explorations in Python, Java, robotics, and electronics
- Accessible entry point that feeds into our full course pathway
</content>

<enroll> Join the Tech Club Meetup group to RSVP for upcoming workshops and get
location updates. Older students can also join the Code Clinic meetup for
advanced topics and pathways into Robot Garage and League Labs.
</enroll>

```
slug: tech-club
image: robot_riot.png
topics: programming, robotics, electronics, games
classes: intro-python, robot-riot, motors-clinic, soldering-clinic, makecode-arcade
category: tech-club
meetup: tech-club
cta: 
    - type: meetup
      label: Join the Tech Club
      url: https://www.meetup.com/the-league-tech-club
```

~~~

The order of the entries in record , along with the data field the entry is assigned to, are:

1) `title`: The start of the record, and title of the record, marked with `#`
2) `blurb`: A single paragraph with the short description, 
3) `description`: A single paragraph with the short description. ( Or, more robust, read text until `<content>`)
4) `content`: The main web page content, marked with `<content>` tags
5) `enroll`: Enrollment instructions, marked with `<enroll>` tags
6) `meta`: a metadata block in a fneced code block, interpretable as the internals of a YAML dict.

The `<enroll>` section holds instructions for how to enroll, which can be
applied to a category, program or class. 

The processing for meta is: 

1) load the contents of the fenced block into a yaml dict
2) For `topics`, `classes`, `for_category` and `category`, if the value is a string, convert it
   to a list by splitting on ',' and stripping spaces
3) Copy all of the values into the top level record. 


The converted JSON for the example record above would be: 

```JSON
  {
    "title": "Tech Club",
    "blurb": "Free introductory classes in Python, Java, robotics, and electronics offered at\nschools, libraries and online",
    "description": "Tech Club brings coding education to students who might not otherwise have\naccess, offering free introductory courses at schools and libraries throughout\nSan Diego County.",
    "content": "These 60-90 minute sessions introduce students in grades 3-12 to\nprogramming through hands-on projects in Python, Java, robotics, and\nelectronics. With a less than 10:1 student-to-teacher ratio and no cost to\nfamilies, Tech Club removes barriers to computer science education. Many\nstudents who start in Tech Club later transition to our paid weekly classes as\nthey advance, but Tech Club provides valuable programming experience regardless\nof whether students continue. Classes run year-round at various locations.\n\n- Multiple weekly meetups hosted across San Diego County\n- Volunteer mentors and alumni support for personalized guidance\n- Hands-on explorations in Python, Java, robotics, and electronics\n- Accessible entry point that feeds into our full course pathway",
    "enroll": "Join the Tech Club Meetup group to RSVP for upcoming workshops and get\nlocation updates. Older students can also join the Code Clinic meetup for\nadvanced topics and pathways into Robot Garage and League Labs.",
    "curriculum": "",
    "meta": {
      "slug": "tech-club",
      "image": "robot_riot.png",
      "topics": [
        "programming",
        "robotics",
        "electronics",
        "games"
      ],
      "classes": [
        "intro-python",
        "robot-riot",
        "motors-clinic",
        "soldering-clinic",
        "makecode-arcade"
      ],
      "category": [
        "tech-club"
      ],
      "meetup": "tech-club",
      "cta": [
        {
          "type": "meetup",
          "label": "Join the Tech Club",
          "url": "https://www.meetup.com/the-league-tech-club"
        }
      ]
    },
    "cta": [
      {
        "type": "meetup",
        "label": "Join the Tech Club",
        "url": "https://www.meetup.com/the-league-tech-club"
      }
    ],
    "slug": "tech-club",
    "image": "robot_riot.png",
    "topics": [
      "programming",
      "robotics",
      "electronics",
      "games"
    ],
    "classes": [
      "intro-python",
      "robot-riot",
      "motors-clinic",
      "soldering-clinic",
      "makecode-arcade"
    ],
    "category": [
      "tech-club"
    ],
    "meetup": "tech-club"
  },
  ```


## Typescript Record


The structured Markdown entries ultimately hydrate a strongly typed record in our
Astro content pipeline. The generated TypeScript type mirrors the logical order
described above and exposes both the narrative fields and the metadata that is
lifted out of the fenced YAML block. The shape is:

```ts
export interface ContentRecord {
  /** Title from the `#` heading. */
    title: string;
    /** One-paragraph summary immediately following the heading. */
    blurb: string;
    /** Supporting description text between the blurb and `<content>` tag. */
    description: string;
    /** Rich body content captured inside the `<content>` block. */
    content: string;

    /** Parsed YAML metadata prior to destructuring onto the record. */
    meta: Record<string, string | string[] | Record<string, unknown> | undefined>;

    // Metadata copied from the fenced YAML block in source order
    slug: string; // name for this entry
    image: string;
    icon?: string; // a font-awesome icon name. 
    topics: string[];
    classes?: string[];
    category?: string[];
    for_category?: string[];
    level?: string;
    meetup?: string;
    cta?: Record[]; // call-to-action buttons and links

    /** Any additional metadata fields are carried through as optional values. */
    [extra: string]: string | string[] | Record<string, unknown> | undefined;
}
```

`topics`, `classes`, and `category` are always normalised to arrays during
parsing—even when the original Markdown supplies a single comma-separated
string—so downstream code should expect lists of strings. The `meta` object is
the raw parsed YAML (after array normalisation) and is preserved alongside the
top-level copies. All other metadata keys from the fenced YAML block (for
example `level` in `classes.md`) are copied through verbatim and surfaced both
within `meta` and as optional properties on the record. Because the YAML block
may express nested objects or lists, both `meta` and the top-level index
signature allow values that are strings, arrays, or arbitrary records.

The `cta` meta field can be written either as a single record or multiple
records, which have the sub-fields `label`, `type` and `url`. If it is specified
as a single record, it is normalized to a list of records. 

Special handling for categories. There is some overlap between programs and
categories: for the programs where  the `category:` is a reference to self (
category == slug ) the program entry should be copied into the categories data. 

# Enrollment

Enrollment information consists of:

* The `<enroll>` content
* The `cta` list for specifying enrollment actions. 

The enrollment information can be placed on:

* A Class
* A Program
* A Category

To display the enrollment block on a page or class, first look in the program or
class record for the `enroll` and `cta` fields. If either do not exist in the
program or class records, look in the associated category record.