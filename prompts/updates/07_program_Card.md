
# Program Card [DONE]

Program Cards ccurrently look like: 

```html
      <ProgramCard>
        <figure class="card__media">
          <img
            src="/images/python_1.png"
            alt="Illustration representing Python coding"
            loading="lazy"
          />
        </figure>
        <div class="card__body">
          <p class="card__eyebrow">BEGINNER</p>
          <h2>Python Coding Classes</h2>
          <description
            >Python is the best language to start with. It's the most popular
            programming language, and useful for every kind of programming.
            Students learn fundamental programming concepts including variables,
            loops, conditionals, functions, and object-oriented programming
            through hands-on projects and real-world applications.</description
          >
          <ul>
            <li>Official Python certificates</li>
            <li>In-person and online cohorts</li>
            <li>Small classes with five students per teacher</li>
            <li>Interactive coding exercises and games</li>
            <li>Portfolio development with GitHub</li>
            <li>Preparation for AP Computer Science Principles</li>
          </ul>
          <price>$280 per month</price>
        </div>
        <footer class="card__footer">
          <div class="button-group enrollment-buttons">
            <a
              class="button button--primary"
              href="https://jtl.pike13.com/group_classes/270616"
              target="_blank"
              rel="noreferrer">Enroll In-Person</a
            >
            <a
              class="button button--primary"
              href="https://jtl.pike13.com/group_classes/255811"
              target="_blank"
              rel="noreferrer">Enroll Online</a
            >
          </div>
          <div class="button-group learn-more-button">
            <a class="program-learn-more-link" href="/programs/classes/python/"
              >Learn More</a
            >
          </div>
        </footer>
      </ProgramCard>

```

But they should work like this: 

```html
      <ProgramCard img="/images/python_1.png" alt="Illustration representing Python coding">
        <CardBody
            eyebrow="BEGINNER"
        >
          <h2 slot="title">Python Coding Classes</h2>
          <description>
            Python is the best language to start with. It's the most popular
            programming language, and useful for every kind of programming.
            Students learn fundamental programming concepts including variables,
            loops, conditionals, functions, and object-oriented programming
            through hands-on projects and real-world applications.
          </description>
          <ul>
            <li>Official Python certificates</li>
            <li>In-person and online cohorts</li>
            <li>Small classes with five students per teacher</li>
            <li>Interactive coding exercises and games</li>
            <li>Portfolio development with GitHub</li>
            <li>Preparation for AP Computer Science Principles</li>
          </ul>
          <price>$280 per month</price>
        </CardBody>
        <CardFooter>
            <Button slot="primary" href="https://jtl.pike13.com/group_classes/270616">Enroll In-Person</Button>
            <Button slot="secondary" href="https://jtl.pike13.com/group_classes/255811">Enroll Online</Button>
            <a slot="learn-more" href="/programs/classes/python/">Learn More</a>
        </CardFooter>
      </ProgramCard>

```

