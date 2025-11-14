# Content specification

The files `programs.md` and `classes.md` are structured Markdown. Each entry describes the content for a program, class or other things. The entries have this format: 


~~~
## Python Programming

Python is the most popular programming language, perfect for beginners
and powerful enough for professionals.

Students learn Python through hands-on projects that build
fundamental programming skills while keeping learning fun and engaging. Our
Python pathway helps students master variables, loops, functions, and
object-oriented programming, preparing them for AP Computer Science Principles
and real-world problem solving. Small cohorts and experienced instructors ensure
every student gets the support they need, whether meeting online or in person.

<content>
Python is the most popular programming language, and useful for every kind of
programming, and it's the easiest to learn! Students learn fundamental
programming concepts including variables, loops, conditionals, functions, and
object-oriented programming through hands-on projects and real-world
applications.

* Official Python certificates
* In-person and online cohorts
* Small classes with five students per teacher
* Interactive coding exercises and games
* Preparation for AP Computer Science Principles
</content>

<enroll> Join the Tech Club Meetup group for fun tech classes, clubs and event
for elementary and middle school students. Join the Code Clinic for older
students for advanced classes and access to the Robot Garage and League Labs
program.
</enroll>

```
slug: python-programming
image: python.png
topics: programming
classes: intro-python, python-apprentice, python-games, python-web-servers, python-orbitlab, makecode-arcade
category: group-classes
enroll: 
    - type: meetup
      label: Join the Tech Club
      url: https://www.meetup.com/the-league-tech-club
    - type: meetup
      label: Join the Code Clinic
      url: https://www.meetup.com/the-league-code-clinic
    - type: page
      label: Join League Labs
      url: http://localhost:4321/programs/league-lab
```
~~~

The order of the entries in record , along with the data field the entry is assigned to, are:

1) `title`: The start of the record, and title of the record, marked with `##`
2) `blurb`: A single paragraph with the short description, 
3) `description`: A single paragraph with the short description. ( Or, more robust, read text until `<content>`)
4) `content`: The main web page content, marked with `<content>` tags
5) `enroll`: Enrollment instructions, marked with `<enroll>` tags
6) `meta`: a metadata block in a fneced code block, interpretable as the internals of a YAML dict.

The `<enroll>` section holds instructions for how to enroll, which can be
applied to a category, program or class. 

The processing for meta is: 

1) load the contents of the fenced block into a yaml dict
2) For `topics`, `classes` and `category`, if the value is a string, convert it
   to a list by splitting on ',' and stripping spaces
3) Copy all of the values into the top level record. 

## Typescript Record


The structured Markdown entries ultimately hydrate a strongly typed record in our
Astro content pipeline. The generated TypeScript type mirrors the logical order
described above and exposes both the narrative fields and the metadata that is
lifted out of the fenced YAML block. The shape is:

```ts
export interface ContentRecord {
    /** Title from the `##` heading. */
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
    slug: string;
    image: string;
    topics: string[];
    classes?: string[];
    category?: string[];
    level?: string;
    meetup?: string;
    buttons?: Record[];

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

The `buttons` meta field can be written either as a single record or multiple
records, which have the sub-fields `label`, `type` and `url`. If it is specified
as a single record, it is normalized to a list of records. 

Special handling for categories. There is some overlap between programs and
categories: for the programs where  the `category:` is a reference to self (
category == slug ) the program entry should be copied into the categories data. 