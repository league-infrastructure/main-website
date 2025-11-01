export const aboutHero = {
  title: 'About The League of Amazing Programmers',
  description:
    'We are a San Diego-based nonprofit teaching coding to 5th–12th graders through eight levels of mastery, from absolute beginner to job-ready, certified programmer.',
  emphasis:
    'We take students through eight levels of mastery, culminating in professional Java certification so every learner can thrive in the workforce of the 21st century.',
  image: {
    src: '/images/about_flag.png',
    alt: 'League students celebrating with The League flag',
  },
};

export const missionStatement = {
  title: 'Our Mission',
  body:
    'We help more youth—especially girls and underserved students—gain the skills, confidence, and mentorship to be leaders in the digital age. Students build critical thinking, self-confidence, and professional certifications that translate directly into college and career opportunities.',
};

export const impactHighlights = [
  {
    title: 'Coding Jobs',
    description:
      'Over one million programming jobs in the United States were projected to remain unfilled by 2022. We spark early interest and provide the training students need to pursue computer science in college and beyond.',
  },
  {
    title: 'Entry Into Workforce',
    description:
      'Our curriculum culminates in Oracle Professional Certification preparation, enabling graduates to enter the workforce as programmers immediately after high school.',
  },
];

export interface TeamMember {
  name: string;
  role: string;
  email?: string;
  image: {
    src: string;
    alt: string;
  };
  link?: string;
}

export const staffTeam: TeamMember[] = [
  {
    name: 'Eric Busboom',
    role: 'Executive Director',
    email: 'eric.busboom@jointheleague.org',
    image: {
      src: '/images/staff/EricBusboom.png',
      alt: 'Portrait of Eric Busboom',
    },
  },
  {
    name: 'Osvaldo Ruiz',
    role: 'Programs Manager',
    email: 'osvaldo.ruiz@jointheleague.org',
    image: {
      src: '/images/staff/OsvaldoRuiz-e1635886323498.png',
      alt: 'Portrait of Osvaldo Ruiz',
    },
  },
  {
    name: 'Liz Groves',
    role: 'Operations',
    email: 'liz.groves@jointheleague.org',
    image: {
      src: '/images/2021/10/Liz-Groves.png',
      alt: 'Portrait of Liz Groves',
    },
  },
  {
    name: 'Michael Johnson',
    role: 'Head Teacher',
    email: 'mike.johnson@jointheleague.org',
    image: {
      src: '/images/staff/MikeJohnson-e1635886431891.png',
      alt: 'Portrait of Michael Johnson',
    },
  },
  {
    name: 'Jed Stumpf',
    role: 'Teacher & Development Manager',
    email: 'jed.stumpf@jointheleague.org',
    image: {
      src: '/images/staff/jed_stumpf-circle.png',
      alt: 'Portrait of Jed Stumpf',
    },
  },
  {
    name: 'Colby Schexnayder',
    role: 'League Teacher',
    email: 'colby.schexnayder@jointheleague.org',
    image: {
      src: '/images/staff/ColbyShexnayder-e1635884609205.png',
      alt: 'Portrait of Colby Schexnayder',
    },
  },
  {
    name: 'Nick Graham',
    role: 'League Teacher',
    email: 'nick.graham@jointheleague.org',
    image: {
      src: '/images/2022/10/Nick-300x300.jpeg',
      alt: 'Portrait of Nick Graham',
    },
  },
  {
    name: 'Keith Groves',
    role: 'Curriculum Manager',
    email: 'keith.groves@jointheleague.org',
    image: {
      src: '/images/staff/KeithGroves2.png',
      alt: 'Portrait of Keith Groves',
    },
    link: 'https://www.linkedin.com/in/keithalgroves/',
  },
  {
    name: 'Daniel Commins',
    role: 'League Teacher',
    email: 'daniel.commins@jointheleague.org',
    image: {
      src: '/images/staff/DanielCommins-e1635886381127.png',
      alt: 'Portrait of Daniel Commins',
    },
  },
  {
    name: 'Tammy Neuhaus',
    role: 'League Teacher',
    image: {
      src: '/images/staff/tammy.jpeg',
      alt: 'Portrait of Tammy Neuhaus',
    },
    link: 'https://www.linkedin.com/in/tamarah-neuhaus-0ba66935/',
  },
];

export const boardMembers: TeamMember[] = [
  {
    name: 'Eric Busboom',
    role: 'Board Chair · President, Civic Knowledge',
    image: {
      src: '/images/staff/EricBusboom.png',
      alt: 'Portrait of Eric Busboom',
    },
  },
  {
    name: 'Christine Dolan',
    role: 'Treasurer · Fractional CFO for Nonprofits',
    image: {
      src: '/images/board/Bio-Pic-C-Dolan.jpg',
      alt: 'Portrait of Christine Dolan',
    },
  },
  {
    name: 'Stan Kurdziel',
    role: 'Senior Android Developer, ResMed',
    image: {
      src: '/images/board/StanKurdziel.png',
      alt: 'Portrait of Stan Kurdziel',
    },
  },
  {
    name: 'Debra Schade',
    role: 'Board Vice President, Solana Beach School District',
    image: {
      src: '/images/board/DebraSchade.png',
      alt: 'Portrait of Debra Schade',
    },
  },
  {
    name: 'Kevin Lee',
    role: 'Software Architect · Former Director of Engineering, Qualcomm',
    image: {
      src: '/images/2022/01/kevin-lee-circle-300x300.png',
      alt: 'Portrait of Kevin Lee',
    },
  },
  {
    name: 'Uyen Tran',
    role: 'Branch Manager, City Heights/Weingart Library',
    image: {
      src: '/images/board/uyen-tran-circle.png',
      alt: 'Portrait of Uyen Tran',
    },
  },
];
