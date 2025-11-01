export const techClubHero = {
  tag: 'Free community classes',
  title: 'The League Tech Club',
  description:
    'Free and low-cost workshops hosted across San Diego libraries, schools, rec centers, and companies introduce students to Python, Java, robotics, electronics, and more.',
  details: [
    'Weekly introductions to Python, Java, robotics, electronics, and JavaScript',
    'Sessions run onsite around San Diego County and live online',
    'Open to grades 4 through 12 with volunteer mentors supporting every class',
  ],
  primaryAction: {
    label: 'Join the Meetup Group',
    href: 'https://www.meetup.com/the-league-tech-club/',
  },
  secondaryAction: {
    label: 'Host a Tech Club Event',
    href: '#host-tech-club',
  },
};

interface ProgramOffering {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
}

export const techClubPrograms: ProgramOffering[] = [
  {
    title: 'Introduction to Python Programming',
    description:
      'Start programming with Turtle graphics, loops, variables, and functions in the world\'s most popular language.',
    image: {
      src: '/images/python.png',
      alt: 'Python class illustration',
    },
  },
  {
    title: 'Introduction to Java Programming',
    description:
      'Build games and simulations in the language used for AP Computer Science and FIRST Robotics competitions.',
    image: {
      src: '/images/java.png',
      alt: 'Java class illustration',
    },
  },
  {
    title: 'Robotics and Microcontrollers',
    description:
      'Program BBC micro:bit controllers to light LEDs, play music, and drive robots using blocks, Python, or JavaScript.',
    image: {
      src: '/images/2024/03/cutebot-1.png',
      alt: 'Microcontroller and robotics illustration',
    },
  },
  {
    title: 'Introduction to JavaScript Programming',
    description:
      'Learn the building blocks of the web with JavaScript inside an approachable online coding environment.',
    image: {
      src: '/images/2024/05/JavascriptLogo.png',
      alt: 'JavaScript logo illustration',
    },
  },
];

interface TopicHighlight {
  title: string;
  body: string;
}

export const techClubTopics: TopicHighlight[] = [
  {
    title: 'Python',
    body:
      'Students explore Python through Turtle graphics before moving into core concepts like variables, loops, and functions. Every class ends with a working program.',
  },
  {
    title: 'Java',
    body:
      'Java introduces professional tools such as GitHub and VS Code while laying the groundwork for AP Computer Science and robotics programming.',
  },
  {
    title: 'Microcontrollers',
    body:
      'Micro:bit microcontrollers let students experiment with sensors, lights, and wireless communication using blocks, Python, or JavaScript.',
  },
  {
    title: 'JavaScript',
    body:
      'JavaScript sessions mirror our Java classes but use a simplified browser-based editor so that newcomers can focus on logic and problem solving.',
  },
];

export const meetupLinks = {
  techClub: 'https://www.meetup.com/the-league-tech-club/',
  codeClinic: 'https://www.meetup.com/the-league-code-clinic/',
};

export const contactInfo = {
  phone: '619-889-7571',
  email: 'eric.busboom@jointheleague.org',
};
