type ActionVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface CTA {
  label: string;
  href: string;
  variant?: ActionVariant;
  target?: string;
  rel?: string;
}

interface HeroAside {
  title: string;
  description?: string;
  items?: string[];
  action?: CTA;
}

interface HeroData {
  tag?: string;
  title: string;
  description: string;
  details?: string[];
  note?: string;
  status?: string;
  actions: CTA[];
  aside?: HeroAside;
}

interface DonationImpactItem {
  title: string;
  description: string;
}

interface DonationMethod {
  title: string;
  description: string;
  cta: CTA;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const donateHero: HeroData = {
  tag: 'Support The League',
  title: 'Fuel the Next Generation of Programmers',
  description:
    'Every contribution keeps tuition affordable, funds scholarships, and equips classrooms so San Diego youth can build real-world coding experience.',
  details: [
    '100% of gifts stay local to mentor students across San Diego County',
    'Small class sizes with professional instructors and volunteer mentors',
    'Scholarships, laptops, and internship stipends for emerging programmers'
  ],
  actions: [
    { label: 'Donate Now', href: '#donate-now', variant: 'primary' },
    { label: 'See Our Supporters', href: '/donate/supporters/', variant: 'secondary' }
  ],
  aside: {
    title: 'Your Gift Supports',
    items: [
      'Sliding-scale tuition and full scholarships',
      'Volunteer mentor training and classroom supplies',
      'Tech Club outreach in libraries, schools, and community centers',
      'League Labs internships that launch student-led curriculum'
    ]
  }
};

export const giveLivelyScript =
  'https://secure.givelively.org/widgets/simple_donation/the-league-of-amazing-programmers.js?show_in_honor_of=true&show_suggested_amount_buttons=true&suggested_donation_amounts[]=500&suggested_donation_amounts[]=250&suggested_donation_amounts[]=125&suggested_donation_amounts[]=75&suggested_donation_amounts[]=25&address_required=false';

export const donationImpact: DonationImpactItem[] = [
  {
    title: 'Scholarships & Tuition Assistance',
    description:
      'Gifts unlock need-based tuition for students who qualify for free and reduced lunch, ensuring cost never blocks a curious learner.'
  },
  {
    title: 'Volunteer Mentor Training',
    description:
      'Donations fund onboarding, background checks, and ongoing mentor development so every class is supported by caring adults.'
  },
  {
    title: 'Equipment & Curriculum',
    description:
      'Support provides laptops, robotics kits, and updated curriculum so students can build, test, and ship real projects.'
  }
];

export const donationMethods: DonationMethod[] = [
  {
    title: 'Recurring Giving',
    description:
      'Set up a sustaining gift through Give Lively to fuel classes every month and help us plan for year-round programming.',
    cta: { label: 'Start a Monthly Gift', href: '#donate-now', variant: 'secondary' }
  },
  {
    title: 'PayPal or Check',
    description:
      'Prefer PayPal or mailing a check? Reach out and we will send instructions for tax receipts and matching paperwork.',
    cta: { label: 'Request Details', href: 'mailto:info@jointheleague.org', variant: 'secondary' }
  },
  {
    title: 'Employer Matching',
    description:
      'Double your impact through corporate matching gifts or payroll deductions. We can provide EIN and verification forms.',
    cta: { label: 'Start a Match', href: 'mailto:info@jointheleague.org?subject=Employer%20Matching%20Gift', variant: 'secondary' }
  },
  {
    title: 'Stock & Donor-Advised Funds',
    description:
      'We gratefully accept appreciated securities and DAF distributions. Contact us to coordinate wire instructions.',
    cta: { label: 'Coordinate a Transfer', href: 'mailto:info@jointheleague.org?subject=Stock%20or%20DAF%20Gift', variant: 'secondary' }
  },
  {
    title: 'Planned Giving',
    description:
      'Create a legacy through estate gifts, beneficiary designations, or charitable trusts that sustain future students.',
    cta: { label: 'Plan a Legacy Gift', href: 'mailto:info@jointheleague.org?subject=Planned%20Giving%20Inquiry', variant: 'secondary' }
  }
];

export const donationFaq: FAQItem[] = [
  {
    question: 'Is my donation tax-deductible?',
    answer:
      'Yes. The League of Amazing Programmers is a 501(c)(3) nonprofit. You will receive an email receipt immediately after giving and a year-end summary upon request.'
  },
  {
    question: 'Can I dedicate my gift in honor of someone?',
    answer:
      'Absolutely. The Give Lively form includes an “In Honor Of” option and we are happy to send a notification card or email to your honoree.'
  },
  {
    question: 'How do I update or cancel a recurring donation?',
    answer:
      'Email info@jointheleague.org and our team will adjust your recurring gift within two business days. You can also make changes directly through Give Lively.'
  },
  {
    question: 'Do you accept in-kind donations?',
    answer:
      'Yes. We welcome new or gently used laptops, robotics kits, and classroom supplies. Contact us to review current needs and drop-off details.'
  }
];

export const supportersHero: HeroData = {
  tag: 'Community of Support',
  title: 'Celebrating the Champions of Future Coders',
  description:
    'Philanthropic partners, foundations, and volunteers power accessible computer science education. Together, we open doors to career paths and lifelong curiosity.',
  actions: [
    { label: 'Become a Sponsor', href: '/donate/the-league-at-work/', variant: 'primary' },
    { label: 'Contact Our Team', href: 'mailto:info@jointheleague.org', variant: 'secondary' }
  ]
};

export const supporterTiers = [
  {
    title: 'Visionary Partners',
    description:
      'Annual investments of $25,000 or more fund full scholarship cohorts, League Labs internships, and multi-site Tech Club expansion.',
    highlights: [
      'Corporate & family foundations aligned with workforce readiness',
      'Multi-year commitments sustaining program growth',
      'Recognition in annual report, website, and student showcases'
    ]
  },
  {
    title: 'Innovation Circle',
    description:
      'Gifts between $5,000 and $24,999 underwrite classroom technology, instructor development, and transportation for community workshops.',
    highlights: [
      'Sponsor a semester of Level 0–6 classes for an entire cohort',
      'Provide laptops and robotics kits for Tech Club participants',
      'Receive personalized impact updates and classroom visits'
    ]
  },
  {
    title: 'Community Builders',
    description:
      'Monthly donors and event sponsors ensure every family can access affordable tuition, field trips, and competition fees.',
    highlights: [
      'Host fundraising events or company volunteer days',
      'Promote campaigns like Hour of Code and Code Jam',
      'Share your expertise as a guest speaker or mentor'
    ]
  }
];

export const gratitudeHighlights = [
  {
    title: 'Corporate Champions',
    body:
      'Thanks to technology companies, startups, and professional associations across San Diego for fueling hands-on learning through sponsorships, pro bono consulting, and employee volunteerism.'
  },
  {
    title: 'Foundation & Civic Partners',
    body:
      'Local foundations and civic groups provide critical grants that stabilize core programs and make tuition assistance possible for families who need it most.'
  },
  {
    title: 'Individual Donors & Alumni',
    body:
      'Parents, alumni, and community advocates give monthly, host peer-to-peer fundraisers, and champion our mission by sharing League stories across their networks.'
  }
];

export const volunteerHero: HeroData = {
  tag: 'Volunteer With Us',
  title: 'Share Your Skills, Inspire Young Programmers',
  description:
    'You do not need to be a professional developer to make a difference. Volunteers coach students, support events, and help classrooms run smoothly—online and in person.',
  details: [
    'Flexible commitments from one-time events to weekly sessions',
    'Training, lesson plans, and on-site staff guidance provided',
    'Background checks covered by The League'
  ],
  actions: [
    {
      label: 'Apply to Volunteer',
      href: 'https://form.typeform.com/to/wniXXT',
      variant: 'primary',
      target: '_blank',
      rel: 'noreferrer'
    },
    { label: 'View Upcoming Events', href: 'https://www.meetup.com/the-league-tech-club/', variant: 'secondary', target: '_blank', rel: 'noreferrer' }
  ]
};

export const volunteerRoles = [
  {
    title: 'Classroom Mentor',
    description:
      'Support instructors during weekly Level 0–6 classes by pairing with students, answering questions, and celebrating milestones.',
    items: [
      'Commit 2–3 hours per week for at least one session block',
      'Comfortable with beginner Java or Python concepts',
      'Shadow experienced mentors before leading breakout rooms'
    ]
  },
  {
    title: 'Tech Club Guide',
    description:
      'Welcome new families at community workshops, set up laptops, and assist with hands-on activities across San Diego libraries and schools.',
    items: [
      'Weekend or evening availability for pop-up events',
      'Great communication skills and excitement for outreach',
      'Ideal for parents, alumni, and corporate volunteer teams'
    ]
  },
  {
    title: 'Special Projects Mentor',
    description:
      'Coach League Labs interns, FIRST Robotics teams, or hackathon participants on advanced topics like AI, web development, or debugging.',
    items: [
      'Subject-matter expertise in software engineering or hardware',
      'Remote and on-site options based on student project needs',
      'Helps students prepare for demos, pitches, and competitions'
    ]
  }
];

export const volunteerSteps = [
  'Submit the volunteer interest form and share your availability.',
  'Complete a short interview and background check (covered by The League).',
  'Attend orientation, shadow a class, and start supporting students.'
];

export const volunteerFaq: FAQItem[] = [
  {
    question: 'Do I need to know how to code?',
    answer:
      'Not necessarily. Many volunteers focus on logistics, encouragement, and project management. We will match you with roles that fit your comfort level.'
  },
  {
    question: 'Can corporate teams volunteer together?',
    answer:
      'Yes. We coordinate custom volunteer days and ongoing mentorship programs for employee groups. Email info@jointheleague.org to design an experience.'
  },
  {
    question: 'Are remote volunteer opportunities available?',
    answer:
      'We offer virtual tutoring, Zoom-based Tech Club sessions, and curriculum review projects throughout the year.'
  }
];

export const leagueAtWorkHero: HeroData = {
  tag: 'Corporate Partnerships',
  title: 'Bring League Classes to Your Workplace',
  description:
    'League at Work delivers on-site or virtual coding experiences for employees and their families. Partner with us to inspire future technologists while investing in your workforce culture.',
  details: [
    'Custom workshops for employee resource groups and family days',
    'Experienced instructors, curriculum, and equipment provided',
    'Build recruiting pathways and corporate social responsibility goals'
  ],
  actions: [
    { label: 'Schedule a Consultation', href: 'mailto:info@jointheleague.org?subject=League%20at%20Work%20Inquiry', variant: 'primary' },
    { label: 'Download Program Overview', href: 'https://www.jointheleague.org/wp-content/uploads/2023/11/League-at-Work.pdf', variant: 'secondary', target: '_blank', rel: 'noreferrer' }
  ]
};

export const leagueAtWorkHighlights = [
  {
    title: 'Family Coding Nights',
    description:
      'Interactive events where employees and their children build games, robotics projects, or AI experiments together under mentor guidance.'
  },
  {
    title: 'Employee Upskilling',
    description:
      'Professional development sessions introducing automation, Python scripting, and data literacy tailored to your business goals.'
  },
  {
    title: 'Community Impact Days',
    description:
      'Host a volunteer drive, hackathon, or fundraiser that engages your team while supporting scholarships for local students.'
  }
];

export const leagueAtWorkProcess = [
  {
    step: 'Discover',
    detail: 'We learn about your goals, audience, preferred format, and schedule.'
  },
  {
    step: 'Design',
    detail: 'Our instructors craft a customized agenda and assemble curriculum, gear, and mentors.'
  },
  {
    step: 'Deliver',
    detail: 'League staff facilitates the experience, captures feedback, and shares impact highlights with your team.'
  }
];

export const fundraiserHero: HeroData = {
  tag: 'Peer-to-Peer Giving',
  title: 'Rally Your Community for The League',
  description:
    'Host a birthday fundraiser, stream-a-thon, or community event to expand access to computer science education. We will supply assets, messaging, and staff support.',
  actions: [
    { label: 'Launch a Fundraiser', href: 'https://secure.givelively.org/donate/the-league-of-amazing-programmers/fundraisers/new', variant: 'primary', target: '_blank', rel: 'noreferrer' },
    { label: 'Download Toolkit', href: 'https://www.jointheleague.org/wp-content/uploads/2023/08/Fundraiser-Toolkit.pdf', variant: 'secondary', target: '_blank', rel: 'noreferrer' }
  ]
};

export const fundraiserIdeas = [
  {
    title: 'Celebration Campaigns',
    description:
      'Dedicate birthdays, graduations, or milestone achievements to The League. Share your story online and invite friends to give in lieu of gifts.'
  },
  {
    title: 'Company or School Challenges',
    description:
      'Set up a friendly competition between departments, classrooms, or clubs. Track progress with a public Give Lively page and unlock prizes along the way.'
  },
  {
    title: 'Streaming & Gaming Events',
    description:
      'Livestream coding challenges, esports tournaments, or maker nights. Collect donations via overlays and interactive goal trackers.'
  }
];

export const fundraiserSteps = [
  'Create your Give Lively fundraising page and personalize the story with photos or video.',
  'Set a goal, choose a campaign timeline, and invite friends, family, and coworkers to join.',
  'Share updates, celebrate milestones, and thank donors with the toolkit templates.'
];

export const fundraiserSupport = [
  {
    title: 'Coaching & Assets',
    body:
      'Our development team provides messaging templates, logos, and sample social posts so you can launch quickly.'
  },
  {
    title: 'Event Support',
    body:
      'Need speakers, student demos, or volunteer mentors? We can coordinate League representatives for your event.'
  },
  {
    title: 'Recognition',
    body:
      'Fundraiser hosts receive shout-outs in our newsletter and social channels, plus invitations to student showcases.'
  }
];
