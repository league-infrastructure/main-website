export const codingProgramsHero = {
  title: 'Weekly Coding That Grows With Students',
  description:
    'Python and Java tracks guide 5th through 12th graders from their first line of code to professional certifications. Students can learn in Carmel Valley, at partner schools, or online from anywhere.',
  details: [
    'Curriculum designed to keep pace with students for four to six years of mastery.',
    'Classes run seven days a week with in-person and live online options.',
  ],
  image: {
    src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/programs.png',
    alt: 'League students collaborating during a coding class',
  },
  actions: [
    { label: 'View Weekly Classes', href: '/coding-programs/classes/' },
    { label: 'Explore Tech Club', href: '/coding-programs/tech-club/' },
  ],
};

export interface ProgramCard {
  title: string;
  level: string;
  description: string;
  price?: string;
  link: string;
  cta: string;
  highlights: string[];
  image?: {
    src: string;
    alt: string;
  };
}

export const mainPrograms: ProgramCard[] = [
  {
    title: 'Python Coding Classes',
    level: 'Beginner',
    description:
      'Start with the most approachable programming language and build real projects while mastering problem solving, logic, and collaboration.',
    price: '$280 per month',
    link: '/coding-programs/classes/python/',
    cta: 'See Python Track',
    highlights: ['Official Python certificates', 'In-person and online cohorts', 'Small classes with five students per teacher'],
    image: {
      src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/python.png',
      alt: 'Illustration representing Python coding',
    },
  },
  {
    title: 'Java Coding Classes',
    level: 'Intermediate to Advanced',
    description:
      'Progress toward AP Computer Science readiness and Oracle Professional Certification with industry-grade tools and mentorship.',
    price: '$280 per month',
    link: '/coding-programs/classes/java/',
    cta: 'Explore Java Track',
    highlights: ['Oracle-aligned curriculum', 'Hybrid and online schedules', 'Project-based learning across eight levels'],
    image: {
      src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/java.png',
      alt: 'Illustration representing Java development',
    },
  },
  {
    title: 'Tech Club',
    level: 'Beginner to Advanced',
    description:
      'Drop into free and low-cost workshops that introduce Python, Java, AI, robotics, electronics, and more across San Diego libraries and schools.',
    price: 'Free',
    link: '/coding-programs/tech-club/',
    cta: 'Join Tech Club',
    highlights: ['Multiple weekly meetups', 'Hands-on demos and mini-projects', 'Volunteer mentors and alumni support'],
    image: {
      src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/codingcamps.png',
      alt: 'Illustration highlighting collaborative workshops',
    },
  },
];

interface ComparisonRow {
  program: string;
  level: string;
  duration: string;
  tuition: string;
  assistance: string;
  schedule: string;
  ratio: string;
  languages: string;
  link: string;
}

export const programComparison: ComparisonRow[] = [
  {
    program: 'Tech Club',
    level: 'Beginner',
    duration: '60 to 90 minutes per class',
    tuition: 'Free',
    assistance: 'Not needed',
    schedule: 'Year-round',
    ratio: '10 students per teacher',
    languages: 'Python',
    link: '/coding-programs/tech-club/',
  },
  {
    program: 'Python Coding Classes',
    level: 'Beginner',
    duration: '1.5 hours weekly',
    tuition: '$280 monthly',
    assistance: 'Available',
    schedule: 'Year-round',
    ratio: '5 students per teacher',
    languages: 'Python',
    link: '/coding-programs/classes/python/',
  },
  {
    program: 'Java Coding Classes',
    level: 'Beginner to Advanced',
    duration: '1.5 hours weekly',
    tuition: '$280 monthly',
    assistance: 'Available',
    schedule: 'Year-round',
    ratio: '5 students per teacher',
    languages: 'Java',
    link: '/coding-programs/classes/java/',
  },
  {
    program: 'Private Classes',
    level: 'All Levels',
    duration: '90 minutes weekly',
    tuition: '$430 monthly',
    assistance: 'Not available',
    schedule: 'Year-round',
    ratio: '1 student per teacher',
    languages: 'Java and Python',
    link: 'https://jointheleague.typeform.com/to/winxxt',
  },
  {
    program: 'Seasonal Coding Camps',
    level: 'All Levels',
    duration: 'Week-long, weekend, and afterschool camps',
    tuition: 'Varies',
    assistance: 'Available',
    schedule: 'Spring, summer, and winter sessions',
    ratio: '5 students per teacher',
    languages: 'Varies by camp',
    link: '/coding-programs/coding-camps/',
  },
];

interface SupportProgram {
  title: string;
  description: string;
  href: string;
}

export const otherPrograms: SupportProgram[] = [
  {
    title: 'Code Clinic',
    description: 'Online deep dives into emerging technologies for advanced students.',
    href: '/coding-programs/tech-club/code-clinic/',
  },
  {
    title: 'Project Clinic',
    description: 'Personalized consulting sessions to ship your independent project.',
    href: '/coding-programs/project-clinic/',
  },
  {
    title: 'FIRST Robot Programming',
    description: 'Free skills classes supporting FIRST FTC and FRC robotics teams.',
    href: '/coding-programs/tech-club/robot-garage/#first',
  },
  {
    title: 'League Labs',
    description: 'Intern with the League to design future curriculum and earn job experience.',
    href: '/coding-programs/league-labs/',
  },
  {
    title: 'Summer Research',
    description: 'Collaborate on research projects in computational science and AI.',
    href: '/coding-programs/coding-camps/summer-2025/summer-projects/#research',
  },
  {
    title: 'League at Work',
    description: 'Bring League instruction to your company as an employee benefit.',
    href: '/donate/the-league-at-work/',
  },
];

interface Highlight {
  title: string;
  body: string;
}

export const whyHighlights: Highlight[] = [
  {
    title: 'Why Python?',
    body:
      'Python has a clear, readable syntax that lets beginners focus on logic. It powers AI, data science, robotics, and scientific computing, making it the ideal first language with limitless career paths.',
  },
  {
    title: 'Why Java?',
    body:
      'Java underpins AP Computer Science and enterprise applications worldwide. Students gain experience with professional tools and patterns used by NASA, finance firms, and large-scale software teams.',
  },
];

export const startOptions = {
  title: 'Try a Class Before You Commit',
  description:
    'Join the League Tech Club via Meetup to sample Java, Python, robotics, electronics, and more. It is the perfect way to explore our teaching style and find the right level.',
  action: {
    label: 'Join the Tech Club',
    href: 'https://www.meetup.com/the-league-tech-club',
  },
  image: {
    src: 'https://www.jointheleague.org/wp-content/uploads/2024/02/TheLEAGUEBlack-300x249.png',
    alt: 'The League Tech Club logo',
  },
};
