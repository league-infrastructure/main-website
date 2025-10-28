export const summer2024Hero = {
  tag: 'Summer Camps 2024',
  title: 'Summer Camps at The League',
  description:
    'Week-long intensives, Tech Discovery adventures, Minecraft modding, Unity game design, and AI explorations led by experienced League instructors.',
  highlights: [
    'Camps for grades 5–12 with beginner-friendly and advanced options',
    'Hands-on projects across coding, robotics, drones, and digital creativity',
    'Small-group instruction plus fun counselor-led activity breaks',
  ],
  primaryAction: {
    label: 'View All 2024 Camps',
    href: 'https://jtl.pike13.com/categories/93521',
  },
  secondaryAction: {
    label: 'Request Scholarship Info',
    href: 'mailto:eric.busboom@jointheleague.org',
  },
};

export interface CampListing {
  title: string;
  level: string;
  summary: string;
  schedule: string[];
  location: string;
  price: string;
  action: {
    label: string;
    href: string;
  };
}

export const featuredCamps: CampListing[] = [
  {
    title: 'AI Camp (with Think Machine)',
    level: 'Beginner & up',
    summary:
      'Discover generative AI, prompt engineering, language models, and creative tools for art, music, and storytelling.',
    schedule: ['Monday – Friday • 1:00 PM – 3:00 PM', 'Sessions offered weekly from June 3 through August 9'],
    location: 'Carmel Valley Campus (CV)',
    price: '$395 per week',
    action: {
      label: 'Book AI Camp',
      href: 'https://jtl.pike13.com/courses/304450',
    },
  },
  {
    title: 'All-Day Tech Discovery Camp',
    level: 'Beginner & up',
    summary:
      'Code games, build robots, fly drones, and explore AI fundamentals in a full-day immersive technology experience.',
    schedule: ['Monday – Friday • 9:00 AM – 3:00 PM', 'Weekly cohorts June 3 – August 9'],
    location: 'Carmel Valley Campus (CV)',
    price: '$950 per week',
    action: {
      label: 'Book Tech Discovery',
      href: 'https://jtl.pike13.com/courses/322093',
    },
  },
  {
    title: 'Half-Day Tech Discovery Camp',
    level: 'Beginner & up',
    summary:
      'Morning-only Tech Discovery for campers who want robotics, drones, and coding in a shorter format.',
    schedule: ['Monday – Friday • 9:00 AM – 12:00 PM', 'Weekly cohorts June 3 – August 9'],
    location: 'Carmel Valley Campus (CV)',
    price: '$475 per week',
    action: {
      label: 'Book Half-Day Tech Discovery',
      href: 'https://jtl.pike13.com/courses/322094',
    },
  },
  {
    title: 'Intro to Python Camp',
    level: 'Beginner',
    summary:
      'Level up problem solving with Python projects featuring games, automations, and data explorations.',
    schedule: [
      'Monday – Friday • 10:00 AM – 12:00 PM',
      'June 3 – 7 • June 17 – 21 • July 8 – 12 • July 22 – 26 • August 5 – 9',
    ],
    location: 'Carmel Valley Campus (CV)',
    price: '$395 per week',
    action: {
      label: 'Book Python Camp',
      href: 'https://jtl.pike13.com/courses/320425',
    },
  },
  {
    title: 'Intro to Java Camp',
    level: 'Beginner',
    summary:
      'Build games and master Java syntax to prepare for AP Computer Science and robotics coding.',
    schedule: ['Monday – Friday • 10:00 AM – 12:00 PM', 'June 10 – 14 • June 24 – 28 • July 15 – 19 • July 29 – August 2'],
    location: 'Carmel Valley Campus (CV)',
    price: '$395 per week',
    action: {
      label: 'Book Java Camp',
      href: 'https://jtl.pike13.com/courses/320134',
    },
  },
  {
    title: 'Unity Game Development',
    level: 'Beginner to advanced',
    summary:
      'Design and ship a cross-platform game while learning the fundamentals of C# and the Unity engine.',
    schedule: ['Monday – Friday • 1:00 PM – 3:00 PM', 'June 12 – 16 • July 10 – 14 • July 31 – August 4'],
    location: 'Carmel Valley Campus (CV)',
    price: '$395 per week',
    action: {
      label: 'Book Unity Camp',
      href: 'https://jtl.pike13.com/courses/265019',
    },
  },
  {
    title: 'Minecraft Modding',
    level: 'Beginner & up',
    summary:
      'Customize Minecraft by coding new items, blocks, mobs, and mechanics with Java programming.',
    schedule: ['Monday – Friday • 2:30 PM – 6:30 PM', 'June 26 – 30 • July 24 – 28 • August 7 – 11'],
    location: 'Carmel Valley Campus (CV)',
    price: '$575 per week',
    action: {
      label: 'Book Minecraft Modding',
      href: 'https://jtl.pike13.com/courses/265022',
    },
  },
  {
    title: 'Computer Hardware Camp',
    level: 'Beginner & up',
    summary:
      'Take apart laptops and desktops, identify components, and rebuild working machines hands-on.',
    schedule: ['Wednesday – Friday • 1:00 PM – 3:00 PM', 'June 21 – 23 • July 19 – 21'],
    location: 'Carmel Valley Campus (CV)',
    price: '$395 per session',
    action: {
      label: 'Book Hardware Camp',
      href: 'https://jtl.pike13.com/courses/320134',
    },
  },
];

export const campTips = [
  'Students should bring water, snacks or lunch (for full-day campers), and any personal devices they prefer to use.',
  'All equipment is provided, including laptops, robotics kits, drones, and microcontrollers.',
  'Activity breaks feature STEM challenges, games, and time outdoors when possible.',
];

export const partnershipHighlight = {
  title: 'Powered by Think Machine',
  description:
    'Our AI camps feature curriculum and mentors from Think Machine, helping students understand how modern AI tools are created and applied.',
  href: 'https://thinkmachine.io/',
  linkLabel: 'Visit Think Machine',
};
