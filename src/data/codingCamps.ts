export const codingCampsHero = {
  tag: 'Camps & Slams',
  title: 'Java, Python, AI and Tech Discovery Camps',
  description:
    'Week-long camps and daily drop-in sessions help students explore Python, Java, AI, robotics, microcontrollers, and game design with League mentors on site in Carmel Valley.',
  highlights: [
    'Beginner-friendly sessions for grades 5 through 12 in person and online',
    'Hands-on projects in AI, robotics, microcontrollers, and web game development',
    'Small group instruction with experienced instructors and volunteer mentors',
  ],
  primaryAction: {
    label: 'Book a Coding Camp',
    href: 'https://jtl.pike13.com/categories/93521',
  },
  secondaryAction: {
    label: 'Reserve a Holiday SLAM',
    href: 'https://jtl.pike13.com/categories/78358',
  },
};

export const codeArcadeInfo = {
  title: 'Summer 2025 Code Arcade',
  description:
    'Drop in for self-paced half-day sessions where students follow their interests across programming, robotics, microcontrollers, and AI. Mentors help every camper plan and ship projects that match their skills.',
  schedule: 'June 1 – August 8, 2025 • Weekdays 9:00 AM – 1:00 PM • Select weekend afternoons',
  price: '$79 per session • Carmel Valley Campus',
  action: {
    label: 'Enroll in Code Arcade',
    href: 'https://jtl.pike13.com/group_classes/341456',
  },
  notes: [
    'Explore Python or Java, build robots with Micro:bit, Arduino, or Raspberry Pi, experiment with AI, or launch an independent project.',
    'Projects adjust to every camper — mix and match topics throughout the week or focus on a single track.',
  ],
};

export interface CampTrack {
  title: string;
  level: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  link?: string;
}

export const campTracks: CampTrack[] = [
  {
    title: 'AI Camp',
    level: 'Beginner and up',
    description:
      'Create art, music, and chatbots while learning prompt engineering, machine vision, and language models in partnership with Think Machine.',
    image: {
      src: '/images/2023/05/AdobeStock_230441943-scaled-e1742318677815.jpeg',
      alt: 'Student experimenting with artificial intelligence tools',
    },
    link: 'https://thinkmachine.io/',
  },
  {
    title: 'Web Games',
    level: 'Beginner and up',
    description:
      'Build and ship games in Python or JavaScript, then publish them so friends and family can play online.',
    image: {
      src: '/images/2025/03/Python-Games-e1742318505702.png',
      alt: 'Pixelated characters representing web game development',
    },
  },
  {
    title: 'Handheld Console Games',
    level: 'Beginner and up',
    description:
      'Program Micro:bit handheld consoles using block code, Python, or JavaScript to create portable retro-inspired games.',
    image: {
      src: '/images/2025/03/meowbit-e1742318910377.png',
      alt: 'Micro:bit handheld game console',
    },
    link: 'https://a.co/d/20ACbkP',
  },
  {
    title: 'Robotics Lab',
    level: 'Beginner and up',
    description:
      'Bring robots to life with motors, sensors, lights, and wireless communication using Micro:bit, Arduino, or Raspberry Pi.',
    image: {
      src: '/images/2024/03/cutebot-1-e1742319239492.png',
      alt: 'Micro:bit powered robotics project',
    },
  },
  {
    title: 'Microcontrollers',
    level: 'Beginner and up',
    description:
      'Design wearable and portable gadgets that react to inputs from buttons, sensors, and LEDs while learning embedded programming.',
    image: {
      src: '/images/2025/04/carte-microbit.jpg',
      alt: 'Microcontroller board connected to sensors and lights',
    },
  },
  {
    title: 'Invent Your Own Project',
    level: 'All levels',
    description:
      'Work with coaches to scope and prototype any technical idea—from music generators to IoT devices—and leave with a plan to continue at home.',
    image: {
      src: '/images/2024/06/IMG_3003-e1742319406441.png',
      alt: 'Student collaborating on a custom coding project',
    },
  },
  {
    title: 'Python Foundations',
    level: 'Beginner to advanced',
    description:
      'Master loops, functions, and data structures while building visualizations, automations, and games in the world’s most popular language.',
    image: {
      src: '/images/2021/09/python.png',
      alt: 'Python logo illustration',
    },
  },
  {
    title: 'Java Foundations',
    level: 'Beginner to advanced',
    description:
      'Learn the language of AP Computer Science and FIRST Robotics with professional tooling such as VS Code, GitHub, and IntelliJ.',
    image: {
      src: '/images/2021/09/java.png',
      alt: 'Java logo illustration',
    },
  },
];

export const slamInfo = {
  title: 'Holiday SLAMS',
  description:
    'SLAMS let current League students accelerate progress by attending daily guided sessions during school breaks. Mentors oversee curriculum work, answer questions, and help students accomplish a full month of learning in a single week.',
  prerequisites: [
    'Open to active League students enrolled in Levels 0 through 6',
    'Designed for learners continuing their weekly classes or preparing for level-ups',
    'Available during winter and spring breaks with morning and afternoon cohorts',
  ],
  action: {
    label: 'Book a SLAM',
    href: 'https://jtl.pike13.com/categories/78358',
  },
};

export const campResources = [
  { label: 'Programming Merit Badge Workbook', href: 'http://www.usscouts.org/mb/worksheets/programming.pdf' },
  { label: 'Python Introduction Curriculum', href: 'https://league-curriculum.github.io/Python-Introduction/' },
  { label: 'Hour of Micro:bit Curriculum', href: 'https://league-curriculum.github.io/HourofMicrobit/' },
];

export const campContact = {
  phone: '619-889-7571',
  email: 'eric.busboom@jointheleague.org',
};
