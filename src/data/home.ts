export const heroContent = {
  eyebrow: 'Igniting Young Minds',
  title: 'Igniting Young Minds Through Coding',
  description:
    'At The League of Amazing Programmers, we prepare kids for the science and technology careers of the 21st century through a multi-level program of weekly classes up to industry certification.',
  primaryCta: { label: 'View Our Programs', href: '/programs/' },
  secondaryCta: { label: 'Join Now', href: 'https://jtl.pike13.com/pages/welcome' },
  image: {
  src: '/images/2021/04/computer-robot-1.png',
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
    'Our Coding Classes are for students in grades 4-12 who are eager to learn programming. Classes are taught by alumni from Brown University, UCSD, Cornell, and more! We work closely with all students to make coding fun and engaging. All our classes are now available in-person or online – you choose.',
  programs: [
    {
      title: 'Python Coding Classes',
      level: 'BEGINNER',
      description:
        'Python is the best language to start with. It\'s the most popular programming language, and useful for every kind of programming.',
      highlights: [
        'Official Python certificates',
        'In-person and online cohorts',
        'Small classes with five students per teacher',
      ],
      price: '$280 per month',
      image: {
  src: '/images/2021/09/python.png',
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
          href: '/programs/classes/python/',
          variant: 'secondary',
        },
      ] satisfies CTA[],
    },
    {
      title: 'Java Coding Classes',
      level: 'BEGINNER TO ADVANCED',
      description:
        'For students of all levels who want to learn industry-level Java programming.',
      highlights: [
        'Oracle-aligned curriculum',
        'Hybrid and online schedules',
        'Project-based learning across eight levels',
      ],
      price: '$280 per month',
      image: {
  src: '/images/2021/09/java.png',
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
          href: '/programs/classes/java/',
          variant: 'secondary',
        },
      ] satisfies CTA[],
    },
  ] satisfies HomeProgramCard[],
};

export const freePrograms = {
  title: 'Free Classes',
  description:
    'Our Tech Club program offers free introductory classes in Python, Java, robotics and electronics to schools and library all over San Diego County. For more advanced students, the Code Clinic offers online classes in professional programming technologies and techniques.',
  programs: [
    {
      title: 'Free Tech Club',
      level: 'BEGINNER TO INTERMEDIATE',
      description:
        'Learn Python, Java, AI, robotics, electronics and many other tech skills a our free Tech Club classes. Tech Club classes are taught several times a week at schools and Libraries all around San Diego and are design for beginners to programming.',
      highlights: [
        'Multiple weekly meetups',
        'Hands-on demos and mini-projects',
        'Volunteer mentors and alumni support',
      ],
      price: 'Free',
      image: {
  src: '/images/2025/04/current_students.png',
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
          href: '/programs/tech-club/',
          variant: 'secondary',
        },
      ] satisfies CTA[],
    },
    {
      title: 'Code Clinic',
      level: 'INTERMEDIATE TO ADVANCED',
      description:
        'Code Clinic is a free online program for advanced students to extend their skills beyond AP Computer Science. In these 1 hour virtual classes, students will get an introduction to tech topics like neural networks, data analysis, Docker containers, code refactoring, functional programming, and many others.',
      highlights: [
        'Live online masterclasses',
        'Focus on emerging technologies',
        'Led by professional engineers',
      ],
      price: 'Free',
      image: {
  src: '/images/2021/09/codingcamps.png',
        alt: 'Illustration of students collaborating on laptops',
      },
      actions: [
        {
          label: 'Request an Invite',
          href: 'https://www.jointheleague.org/programs/tech-club/code-clinic/',
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
  href: '/programs/league-labs/',
    },
    {
      title: 'Project Clinic',
      description: 'Partner with our mentors to ship independent programming, robotics, or electronics projects.',
  href: '/programs/project-clinic/',
    },
    {
      title: 'Programming Merit Badge',
      description: 'Complete Programming Merit Badge requirement 5 in a free 90-minute workshop.',
  href: '/programs/tech-club/programming-merit-badge/',
    },
    {
      title: 'FIRST Robot Programming',
      description: 'Free skills classes supporting FIRST FTC and FRC robotics teams throughout the season.',
  href: '/programs/tech-club/robot-garage/#first',
    },
  ] satisfies OtherProgram[],
};

export const recognition = {
  title: 'Community Recognition',
  description: 'We are proud to earn the trust of families, partners, and philanthropic leaders across San Diego.',
  badges: [
    {
      name: 'Guidestar Platinum Seal',
  src: '/images/2021/09/Seal-2023-transp-1400px.png',
      href: 'https://www.guidestar.org/profile/shared/64911aa4-cc70-40d6-93be-0f7cad50f6d7',
    },
    {
      name: 'GreatNonprofits Top-Rated',
  src: '/images/2021/10/toprated.png',
      href: 'https://greatnonprofits.org/org/league-of-amazing-programmers',
    },
    {
      name: 'Scout Programs',
  src: '/images/2022/01/logo2-800x658.png',
  href: 'https://www.jointheleague.org/programs/tech-club/programming-merit-badge/',
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
    'Students are prepared to enter the work force as a programmer or to continue their education in a college or university. We work closely with students to gain professional certification as a Java programmer and secure job opportunities at top companies. Our students have secured opportunities with many familiar names.',
  logos: [
  { name: 'Google', src: '/images/2021/10/google.png' },
  { name: 'Amazon', src: '/images/2021/10/amazon.png' },
  { name: 'Microsoft', src: '/images/2021/10/microsoft.png' },
  { name: 'Sony', src: '/images/2021/10/sony.png' },
  { name: 'Intuit', src: '/images/2021/10/intuit.png' },
  { name: 'PlayStation', src: '/images/2021/10/playstation-e1633381878724.png' },
  ],
};

export const testimonials = [
  {
    quote:
      'The LEAGUE of Amazing Programmers have build my confidence to become an engineer. I\'ve had a wonderful experience so far with the league classes and the extraordinary internship that changed my perspective in engineering.',
    author: 'Stephanie',
    role: 'Student',
  },
  {
    quote:
      'The LEAGUE of Amazing Programmers has helped me develop my software skills and also improve my skills in problem solving. The skills I learned from the league helped me lead an award winning robotics team in the San Diego Region.',
    author: 'Lucas',
    role: 'Student',
  },
  {
    quote:
      'I first joined The LEAGUE of Amazing Programmers in the 7th grade as just something my mom wanted me to do. Little did I know that it would become not only one of my favorite activities but would develop into my career choice.',
    author: 'R. Ramirez',
    role: 'Student',
  },
];

export const galleryImages = [
  {
  src: '/images/2021/05/Copy-of-MX-Library-Workshop_1.png',
    alt: 'Students collaborating in coding workshop',
  },
  {
  src: '/images/2021/05/Copy-of-Forcepoint-Cybersecurity-Comp_4-e1632432194464.png',
    alt: 'Students attending cybersecurity competition',
  },
  {
  src: '/images/2021/05/girl-scouts-2020-03.png',
    alt: 'Girl Scouts learning robotics at The League',
  },
];

export const primaryCta = {
  title: 'Get Started',
  description: 'Ready to begin? Explore programs or jump right into enrollment today.',
  primary: { label: 'View Our Programs', href: '/programs/' },
  secondary: { label: 'Join Now', href: 'https://jtl.pike13.com/pages/welcome' },
};

export const tuitionAssistance = {
  title: 'Tuition Assistance',
  description: 'As a non-profit organization, we believe that all children should have the opportunity to learn computer programming regardless of their family\'s financial status. We currently offer tuition assistance to students in San Diego County based on their ability to pay. If your child participates in the Federal Free and Reduced Lunch Program, you may be eligible to receive 100% financial aid for workshops and regular classes. We also offer varying discounts on tuition (sliding scale) depending on your total household income.',
  note: 'Please note: tuition assistance must be renewed every year and regular attendance is required. If a student is not attending classes regularly, LEAGUE reserves the right to reverse enrolling the student from the program.',
  cta: {
    label: 'Apply Now',
    href: 'https://jointheleague.typeform.com/to/WF4LUN'
  }
};

export const communityVideo = {
  title: 'Hear From Our Community',
  embedUrl: 'https://player.vimeo.com/video/290793328',
};
