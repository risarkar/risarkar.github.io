export type SkillId = string

export type Skill = {
  id: SkillId
  category: string
  title: string
  description: string
}

export type Experience = {
  id: string
  role: string
  organization: string
  place: string
  period: string
  summary: string
  details: string[]
  skills: SkillId[]
}

export type Project = {
  id: string
  eyebrow: string
  title: string
  summary: string
  contribution: string
  outcome: string
  skills: SkillId[]
  visual?: 'malware' | 'light' | 'lab' | 'lineage'
  links: { label: string; href: string }[]
  credit?: string
}

// Edit this file to update the public site. Add or remove array entries below as needed.
// Skills on work and credentials automatically create the links shown in the Skills section.
export const siteContent = {
  heroTitle: { first: 'Your system.', focus: 'I Secure it.', last: 'Simple!' },
  heroLead: 'I am Rishiraj Sarkar, a cybersecurity graduate student at the University of Michigan-Dearborn. I build and test systems across malware detection, secure connected devices, and privacy operations.',
  availability: 'Seeking full-time AI security roles after May 2027.',
  contactIntro: 'I am interested in full-time roles where AI and security meet. If my work fits what you are building, I would like to hear about it.',
  email: 'risarkar@umich.edu',
  linkedIn: 'https://www.linkedin.com/in/risarkar',
  github: 'https://github.com/risarkar'
}

export const education = [
  { period: '2025 to May 2027', degree: 'M.S. in Cybersecurity and Information Assurance', school: 'University of Michigan-Dearborn', detail: 'I focus on network and systems security. My current GPA is 3.95.' },
  { period: 'Graduated 2023', degree: 'B.Tech in Electronics and Communication Engineering', school: 'Manipal Institute of Technology', detail: 'I also completed a minor in data science.' }
]

export const community = {
  role: 'Co-Leader, Google Developers Group Detroit',
  description: 'I help organize events that bring builders together, including Michigan DevFest, Hack Michigan, and community summits.'
}

export const skills: Skill[] = [
  {
    id: 'ml-detection',
    category: 'AI security',
    title: 'Machine learning for detection',
    description: 'I compare model behavior, failure modes, and the cost of missed signals.'
  },
  {
    id: 'trustworthy-ai',
    category: 'AI security',
    title: 'Trustworthy AI',
    description: 'I look beyond model scores to ask where training data and real use can break trust.'
  },
  {
    id: 'network-defense',
    category: 'Security engineering',
    title: 'Network defense and SIEM',
    description: 'I build lab environments that make attacks, logs, and defensive decisions visible.'
  },
  {
    id: 'secure-systems',
    category: 'Security engineering',
    title: 'Secure connected systems',
    description: 'I work through the constraints of sensors, communication, and reliable software.'
  },
  {
    id: 'privacy-risk',
    category: 'Risk and privacy',
    title: 'Privacy, risk, and controls',
    description: 'I turn complex requirements into clear actions that engineering teams can use.'
  },
  {
    id: 'gen-ai',
    category: 'AI systems',
    title: 'Generative AI tools',
    description: 'I test where local and agentic tools help a security workflow, and where they need scrutiny.'
  },
  {
    id: 'software-engineering',
    category: 'Engineering',
    title: 'Python and C++ engineering',
    description: 'I use code to test ideas, examine behavior, and ship dependable tools.'
  }
]

export const certifications = [
  {
    id: 'cert-cybersecurity',
    name: 'Google Cybersecurity Certificate',
    issuer: 'Google',
    url: 'https://www.coursera.org/verify/professional-cert/WXS4F7CGARTV',
    skills: ['network-defense', 'privacy-risk'] as SkillId[]
  },
  {
    id: 'cert-genai',
    name: 'Google Cloud Certified Generative AI Leader',
    issuer: 'Google Cloud',
    url: 'https://www.credly.com/badges/1e801f22-732d-402c-88c0-dd00d7c8bb05/public_url',
    skills: ['gen-ai'] as SkillId[]
  }
]

export const experience: Experience[] = [
  {
    id: 'experience-tai',
    role: 'Research Assistant',
    organization: 'Trustworthy AI-driven IoT Lab',
    place: 'University of Michigan-Dearborn',
    period: 'March 2026 to July 2026',
    summary: 'I worked on secure communication and machine learning in hardware-constrained connected systems.',
    details: [
      'I developed prototypes for encrypted communication between moving vehicles using sensors and light.',
      'I built a model that maps lightweight sensor data to richer sensing information without adding hardware.'
    ],
    skills: ['secure-systems', 'ml-detection']
  },
  {
    id: 'experience-deloitte',
    role: 'Associate Solution Advisor',
    organization: 'Deloitte USI',
    place: 'Bengaluru, India',
    period: 'October 2023 to July 2025',
    summary: 'I helped run privacy, safeguard, and change control work for a major technology client.',
    details: [
      'I connected engineering and compliance teams, turning GDPR and CPRA requirements into prioritized actions.',
      'I built a tracking dashboard and authored more than 390 assessor-facing documents under strict change control.'
    ],
    skills: ['privacy-risk']
  },
  {
    id: 'experience-nevaeh',
    role: 'C++ Developer',
    organization: 'Nevaeh Technology',
    place: 'Kolkata, India',
    period: 'January 2023 to July 2023',
    summary: 'I developed and debugged a Linux trading system where correctness and latency mattered.',
    details: [
      'I owned code for an international exchange integration and traced critical production defects to their causes.'
    ],
    skills: ['software-engineering']
  }
]

export const projects: Project[] = [
  {
    id: 'project-malware',
    eyebrow: 'Featured project / AI security',
    title: 'Finding malware in behavior, not just signatures.',
    summary: 'Our team compared machine learning models using execution traces from benign and malicious Windows programs.',
    contribution: 'I trained and evaluated the MLP and XGBoost models. The team compared eight model families and studied their detection tradeoffs.',
    outcome: 'Random Forest emerged as the strongest baseline for this dataset. The work sets up future evasion testing.',
    skills: ['ml-detection', 'trustworthy-ai', 'software-engineering'],
    visual: 'malware',
    links: [{ label: 'View the team repository', href: 'https://github.com/risarkar/Win_Malware_Evasion' }]
  },
  {
    id: 'project-vehicle',
    eyebrow: 'Research / secure IoT',
    title: 'Securing communication on the move.',
    summary: 'At the TAI Lab, I prototyped encrypted communication between moving vehicles using sensors and light.',
    contribution: 'I wrote prototype code and built a model that maps lightweight sensor readings to richer sensing information.',
    outcome: 'The research explored stronger sensing and secure communication within hardware constraints.',
    skills: ['secure-systems', 'ml-detection'],
    visual: 'light',
    links: []
  },
  {
    id: 'project-homelab',
    eyebrow: 'Ongoing practice / security lab',
    title: 'A lab built to see what breaks.',
    summary: 'I run a self-hosted lab for network attack and defense drills, log collection, and security architecture experiments.',
    contribution: 'I use Kali Linux, Chronicle, and Splunk to observe behavior. I also test local and agentic AI tools for triage workflows.',
    outcome: 'The lab gives me a place to connect security theory with signals that a defender can actually inspect.',
    skills: ['network-defense', 'gen-ai'],
    visual: 'lab',
    links: []
  },
  {
    id: 'project-poisonspot',
    eyebrow: 'Exploration / trustworthy AI',
    title: 'Following the trail of poisoned training data.',
    summary: 'I explored PoisonSpot, a published approach to tracing how training samples influence model updates.',
    contribution: 'My public PoisonDash repository contains a small interface for examining PoisonSpot performance.',
    outcome: 'This is an exploration of the research, not a claim of authorship of PoisonSpot or its paper.',
    skills: ['trustworthy-ai', 'software-engineering'],
    visual: 'lineage',
    links: [
      { label: 'View PoisonDash', href: 'https://github.com/risarkar/PoisonDash' },
      { label: 'View the original research', href: 'https://github.com/um-dsp/PoisonSpot' }
    ],
    credit: 'Original PoisonSpot research and code by the University of Michigan-Dearborn DSP group.'
  }
]

export const skillName = Object.fromEntries(skills.map(({ id, title }) => [id, title])) as Record<SkillId, string>

export function evidenceForSkill(id: SkillId) {
  return [
    ...projects.filter((item) => item.skills.includes(id)).map((item) => ({ label: item.title, href: `#${item.id}`, source: 'Project' })),
    ...experience.filter((item) => item.skills.includes(id)).map((item) => ({ label: `${item.organization} experience`, href: `#${item.id}`, source: 'Experience' })),
    ...certifications.filter((item) => item.skills.includes(id)).map((item) => ({ label: item.name, href: `#${item.id}`, source: 'Credential' }))
  ]
}

export function validatePortfolio() {
  const allItems = [...skills, ...experience, ...projects, ...certifications]
  const allIds = allItems.map((item) => item.id)
  if (new Set(allIds).size !== allIds.length) throw new Error('Portfolio entries need unique IDs.')
  const skillIds = new Set(skills.map((item) => item.id))
  for (const item of [...experience, ...projects, ...certifications]) {
    for (const id of item.skills) {
      if (!skillIds.has(id)) throw new Error(`${item.id} refers to a missing skill: ${id}`)
    }
  }
}
