export const heroContent = {
  eyebrow: 'Igniting Young Minds',
  title: 'Igniting Young Minds Through Coding',
  description:
    'At The League of Amazing Programmers, we prepare kids for the science and technology careers of the 21st century through a multi-level program of weekly classes up to industry certification.',
  primaryCta: { label: 'View Our Programs', href: '/coding-programs/' },
  secondaryCta: { label: 'Join Now', href: 'https://jtl.pike13.com/pages/welcome' },
  image: {
    src: 'https://www.jointheleague.org/wp-content/uploads/2021/04/computer-robot-1.png',
    alt: 'Student-built robot with laptop',
  },
};

type CTA = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  target?: string;
  rel?: string;
};

interface HomeProgramCard {
  title: string;
  level: string;
  description: string;
  highlights: string[];
  price?: string;
  image?: {
    src: string;
    alt: string;
  };
  actions: CTA[];
}

interface OtherProgram {
  title: string;
  description: string;
  href: string;
}

interface RecognitionBadge {
  name: string;
  src: string;
  href: string;
}

export const weeklyPrograms = {
  title: 'Weekly Programming Classes',
  description:
    'Our coding classes are for students in grades 4-12 who are eager to learn programming. Classes are taught by alumni from Brown University, UCSD, Cornell, and more. We work closely with every student to make coding fun and engaging, in-person or online.',
  programs: [
    {
      title: 'Python Coding Classes',
      level: 'Beginner',
      description:
        'Python is the most popular first language for a reason. Students build projects while mastering problem solving, logic, and collaboration.',
      highlights: [
        'Official Python certificates',
        'In-person and online cohorts',
        'Small classes with five students per teacher',
      ],
      price: '$280 per month',
      image: {
        src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/python.png',
        alt: 'Illustration representing Python coding',
      },
      actions: [
        {
          label: 'Enroll In-Person',
          href: 'https://jtl.pike13.com/group_classes/270616',
          target: '_blank',
          rel: 'noreferrer',
        },
        {
          label: 'Enroll Online',
          href: 'https://jtl.pike13.com/group_classes/255811',
          target: '_blank',
          rel: 'noreferrer',
          variant: 'secondary',
        },
        {
          label: 'Learn More',
          href: '/coding-programs/classes/python/',
          variant: 'secondary',
        },
      ] satisfies CTA[],
    },
    {
      title: 'Java Coding Classes',
      level: 'Beginner to Advanced',
      description:
        'Progress toward AP Computer Science readiness and Oracle Professional Certification with industry-grade tools and mentorship.',
      highlights: [
        'Oracle-aligned curriculum',
        'Hybrid and online schedules',
        'Project-based learning across eight levels',
      ],
      price: '$280 per month',
      image: {
        src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/java.png',
        alt: 'Illustration representing Java development',
      },
      actions: [
        {
          label: 'Enroll In-Person',
          href: 'https://jtl.pike13.com/group_classes/263387',
          target: '_blank',
          rel: 'noreferrer',
        },
        {
          label: 'Enroll Online',
          href: 'https://jtl.pike13.com/group_classes/191042',
          target: '_blank',
          rel: 'noreferrer',
          variant: 'secondary',
        },
        {
          label: 'Learn More',
          href: '/coding-programs/classes/java/',
          variant: 'secondary',
        },
      ] satisfies CTA[],
    },
  ] satisfies HomeProgramCard[],
};

export const freePrograms = {
  title: 'Free Classes',
  description:
    'Explore no-cost workshops that introduce Python, Java, robotics, and professional programming skills across San Diego and online.',
  programs: [
    {
      title: 'Free Tech Club',
      level: 'Beginner to Intermediate',
      description:
        'Learn Python, Java, AI, robotics, electronics, and more in weekly sessions at schools and libraries around San Diego County.',
      highlights: [
        'Multiple weekly meetups',
        'Hands-on demos and mini-projects',
        'Volunteer mentors and alumni support',
      ],
      price: 'Free',
      image: {
        src: 'https://www.jointheleague.org/wp-content/uploads/2025/04/current_students.png',
        alt: 'Students attending Tech Club workshop',
      },
      actions: [
        {
          label: 'See Upcoming Sessions',
          href: 'https://www.meetup.com/the-league-tech-club',
          target: '_blank',
          rel: 'noreferrer',
        },
        {
          label: 'Learn More',
          href: '/coding-programs/tech-club/',
          variant: 'secondary',
        },
      ] satisfies CTA[],
    },
    {
      title: 'Code Clinic',
      level: 'Intermediate to Advanced',
      description:
        'Extend skills beyond AP Computer Science with guided dives into neural networks, data analysis, Docker, functional programming, and more.',
      highlights: [
        'Live online masterclasses',
        'Focus on emerging technologies',
        'Led by professional engineers',
      ],
      price: 'Free',
      image: {
        src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/codingcamps.png',
        alt: 'Illustration of students collaborating on laptops',
      },
      actions: [
        {
          label: 'Request an Invite',
          href: 'https://www.jointheleague.org/coding-programs/tech-club/code-clinic/',
        },
      ] satisfies CTA[],
    },
  ] satisfies HomeProgramCard[],
};

export const otherProgramsHome = {
  title: 'Other Programs',
  description:
    'Dive deeper with specialty clinics, internships, and badges that keep students building between weekly classes.',
  programs: [
    {
      title: 'League Labs',
      description: 'Intern with the LEAGUE; get job experience while creating new classes for future students.',
      href: '/coding-programs/league-labs/',
    },
    {
      title: 'Project Clinic',
      description: 'Partner with our mentors to ship independent programming, robotics, or electronics projects.',
      href: '/coding-programs/project-clinic/',
    },
    {
      title: 'Programming Merit Badge',
      description: 'Complete Programming Merit Badge requirement 5 in a free 90-minute workshop.',
      href: '/coding-programs/tech-club/programming-merit-badge/',
    },
    {
      title: 'FIRST Robot Programming',
      description: 'Free skills classes supporting FIRST FTC and FRC robotics teams throughout the season.',
      href: '/coding-programs/tech-club/robot-garage/#first',
    },
  ] satisfies OtherProgram[],
};

export const tuitionAssistance = {
  title: 'Tuition Assistance',
  lead: 'We believe every student deserves access to computer science education regardless of household income.',
  details: [
    'Sliding-scale tuition for workshops and weekly classes',
    '100% financial aid for students in the Federal Free and Reduced Lunch Program',
    'Annual renewal with mentorship to keep students progressing',
  ],
  apply: {
    label: 'Apply Now',
    href: 'https://jointheleague.typeform.com/to/WF4LUN',
    target: '_blank',
    rel: 'noreferrer',
  } satisfies CTA,
  note:
    'Tuition assistance must be renewed each year. Regular attendance is required to maintain eligibility.',
};

export const recognition = {
  title: 'Community Recognition',
  description: 'We are proud to earn the trust of families, partners, and philanthropic leaders across San Diego.',
  badges: [
    {
      name: 'Guidestar Platinum Seal',
      src: 'https://www.jointheleague.org/wp-content/uploads/2021/09/Seal-2023-transp-1400px.png',
      href: 'https://www.guidestar.org/profile/shared/64911aa4-cc70-40d6-93be-0f7cad50f6d7',
    },
    {
      name: 'GreatNonprofits Top-Rated',
      src: 'https://www.jointheleague.org/wp-content/uploads/2021/10/toprated.png',
      href: 'https://greatnonprofits.org/org/league-of-amazing-programmers',
    },
    {
      name: 'Scout Programs',
      src: 'https://www.jointheleague.org/wp-content/uploads/2022/01/logo2-800x658.png',
      href: 'https://www.jointheleague.org/coding-programs/tech-club/programming-merit-badge/',
    },
  ] satisfies RecognitionBadge[],
};

export const newsletter = {
  title: 'Subscribe to Our Newsletter',
  description:
    'Get League news, upcoming classes, and student highlights delivered monthly.',
  cta: {
    label: 'Sign Up',
    href: 'mailto:info@jointheleague.org?subject=Newsletter%20Signup',
  },
};

export const careerPrep = {
  title: 'Preparing Youth for Careers',
  description:
    'Students are prepared to enter the workforce as programmers or continue their education in college. We work closely with students to earn professional Java certification and secure opportunities at top companies. Our students have secured opportunities with many familiar names.',
  logos: [
    { name: 'Google', src: 'https://www.jointheleague.org/wp-content/uploads/2021/10/google.png' },
    { name: 'Amazon', src: 'https://www.jointheleague.org/wp-content/uploads/2021/10/amazon.png' },
    { name: 'Microsoft', src: 'https://www.jointheleague.org/wp-content/uploads/2021/10/microsoft.png' },
    { name: 'Sony', src: 'https://www.jointheleague.org/wp-content/uploads/2021/10/sony.png' },
    { name: 'Intuit', src: 'https://www.jointheleague.org/wp-content/uploads/2021/10/intuit.png' },
    { name: 'PlayStation', src: 'https://www.jointheleague.org/wp-content/uploads/2021/10/playstation-e1633381878724.png' },
  ],
};

export const testimonials = [
  {
    quote:
      'The LEAGUE of Amazing Programmers has built my confidence to become an engineer. The classes and internship changed how I view engineering.',
    author: 'Stephanie',
    role: 'Student',
  },
  {
    quote:
      'My software skills and problem-solving ability have grown so much. The League helped me lead an award-winning robotics team in San Diego.',
    author: 'Lucas',
    role: 'Student',
  },
  {
    quote:
      'I joined The League in 7th grade. It quickly became a favorite activity and set me on the path toward a career in programming.',
    author: 'R. Ramirez',
    role: 'Student',
  },
];

export const galleryImages = [
  {
    src: 'https://www.jointheleague.org/wp-content/uploads/2021/05/Copy-of-MX-Library-Workshop_1.png',
    alt: 'Students collaborating in coding workshop',
  },
  {
    src: 'https://www.jointheleague.org/wp-content/uploads/2021/05/Copy-of-Forcepoint-Cybersecurity-Comp_4-e1632432194464.png',
    alt: 'Students attending cybersecurity competition',
  },
  {
    src: 'https://www.jointheleague.org/wp-content/uploads/2021/05/girl-scouts-2020-03.png',
    alt: 'Girl Scouts learning robotics at The League',
  },
];

export const primaryCta = {
  title: 'Get Started',
  description: 'Ready to begin? Explore programs or jump right into enrollment today.',
  primary: { label: 'View Our Programs', href: '/coding-programs/' },
  secondary: { label: 'Join Now', href: 'https://jtl.pike13.com/pages/welcome' },
};

export const communityVideo = {
  title: 'Hear From Our Community',
  embedUrl: 'https://player.vimeo.com/video/290793328',
};
