export const summer2025Hero = {
  tag: 'Summer 2025',
  title: 'Summer Code Arcade',
  description:
    'A flexible half-day camp where students prototype games, build robots, explore AI, and level up Python or Java skills with League mentors.',
  dates: 'June 1 – August 8, 2025',
  time: 'Weekdays • 9:00 AM – 1:00 PM (select weekend afternoons 1:00 – 4:00 PM)',
  location: 'Carmel Valley Campus',
  price: '$79 per session',
  primaryAction: {
    label: 'Enroll in Code Arcade',
    href: 'https://jtl.pike13.com/group_classes/341456',
  },
  secondaryAction: {
    label: 'Ask About Scholarships',
    href: 'mailto:eric.busboom@jointheleague.org',
  },
};

export const dropInHighlights = [
  'Self-paced coaching for Python, Java, robotics, AI, and microcontrollers',
  'Mentors help campers scope projects that match their experience and interests',
  'Combine Code Arcade mornings with afternoon SLAMS or Tech Club events for full-day learning',
];

export const dropInNotes = [
  'Choose the days that work for your family—no multi-week commitment required.',
  'Campers can rotate between topics or stay focused on one area throughout the week.',
  'Every session ends with progress checkpoints so students know how to keep building from home.',
];

export interface WeeklyCamp {
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

export const weeklyCamps: WeeklyCamp[] = [
  {
    title: 'Intro to Python Camp',
    level: 'Beginner',
    summary:
      'Learn the foundations of Python through games, animations, and problem-solving challenges designed for first-time coders.',
    schedule: ['Monday – Friday • 10:00 AM – 12:00 PM', 'June 3 – 7', 'June 17 – 21', 'July 8 – 12', 'July 22 – 26', 'August 5 – 9'],
    location: 'Carmel Valley Campus (CV)',
    price: '$395 per week',
    action: {
      label: 'Book Python Camp',
      href: 'https://jtl.pike13.com/courses/320425',
    },
  },
  {
    title: 'Intro to Java Camp',
    level: 'Beginner to Intermediate',
    summary:
      'Step into the language of AP Computer Science while building interactive games and mastering professional developer tools.',
    schedule: ['Monday – Friday • 10:00 AM – 12:00 PM', 'June 10 – 14', 'June 24 – 28', 'July 15 – 19', 'July 29 – August 2'],
    location: 'Carmel Valley Campus (CV)',
    price: '$395 per week',
    action: {
      label: 'Book Java Camp',
      href: 'https://jtl.pike13.com/courses/320134',
    },
  },
];

export const dailyFlow = [
  { time: '9:00 AM', activity: 'Check-in, project planning, and progress goals with mentors' },
  { time: '9:30 AM', activity: 'Guided workshops covering Python, Java, AI, or robotics fundamentals' },
  { time: '10:45 AM', activity: 'Build time with one-on-one coaching and debugging support' },
  { time: '12:30 PM', activity: 'Showcase, reflections, and take-home resources' },
];

export const faqItems = [
  {
    question: 'What skill level do campers need?',
    answer:
      'All experience levels are welcome. Mentors tailor goals to each student, whether they are writing their first line of code or advancing toward AP Computer Science and robotics competitions.',
  },
  {
    question: 'Do students need to bring a laptop?',
    answer:
      'Devices are provided, but campers may bring their own if they prefer. We recommend bringing a USB drive or GitHub account to save projects.',
  },
  {
    question: 'Can I combine Code Arcade with a Holiday SLAM?',
    answer:
      'Yes. Many campers attend Code Arcade in the morning and join SLAM sessions or Tech Club meetups later in the day for additional practice.',
  },
  {
    question: 'Is financial assistance available?',
    answer:
      'Scholarships are available. Email eric.busboom@jointheleague.org and our team will follow up with the latest opportunities.',
  },
];
