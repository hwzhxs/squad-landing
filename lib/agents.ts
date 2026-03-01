export interface Agent {
  name: string;
  nickname: string;
  emoji: string;
  role: string;
  subtitle: string;
  description: string;
  accent: string;
  primary: string;
  cardBg: string;
  gradientFrom: string;
  gradientTo: string;
  image: string;
}

// Base path prefix for GitHub Pages — set via NEXT_PUBLIC_BASE_PATH env var
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Order: Popo (Admin), Tyler (Creator), Kanye (Thinker), Rocky (Gatekeeper)
export const agents: Agent[] = [
  {
    name: 'Popo',
    nickname: 'Admin',
    emoji: '\u{1F693}',
    role: 'Coordinator',
    subtitle: 'The Police',
    description: 'Orchestrates the entire operation. Assigns missions, coordinates handoffs, maintains order across the squad. The law of the land.',
    primary: '#3A4F7A',
    accent: '#8B7D5C',
    cardBg: '#1a2a3a',
    gradientFrom: '#0D1520',
    gradientTo: '#1A2A42',
    image: `${BASE}/images/agents/admin.png`,
  },
  {
    name: 'Tyler',
    nickname: 'Creator',
    emoji: '\u{1F3A8}',
    role: 'Builder',
    subtitle: 'The Creator',
    description: 'Turns ideas into things people can see, touch, and feel. Code, design, implementation \u2014 every pixel shipped with intention.',
    primary: '#C49A1A',
    accent: '#D4A843',
    cardBg: '#1e1a10',
    gradientFrom: '#141210',
    gradientTo: '#2A2418',
    image: `${BASE}/images/agents/creator.png`,
  },
  {
    name: 'Kanye',
    nickname: 'Thinker',
    emoji: '\u{1F9E0}',
    role: 'Researcher',
    subtitle: 'The Thinker',
    description: 'Goes deep where others skim. Research, analysis, specs \u2014 the strategic brain that shapes every decision.',
    primary: '#E8E0D0',
    accent: '#C8A84E',
    cardBg: '#2a2824',
    gradientFrom: '#1A1918',
    gradientTo: '#2A2824',
    image: `${BASE}/images/agents/thinker.png`,
  },
  {
    name: 'Rocky',
    nickname: 'Gatekeeper',
    emoji: '\u{1F6E1}',
    role: 'Reviewer',
    subtitle: 'The Gatekeeper',
    description: 'Quality control without compromise. Every deliverable passes through before shipping. Nothing slips past the gate.',
    primary: '#D4940C',
    accent: '#E8A020',
    cardBg: '#2a1e08',
    gradientFrom: '#1A1408',
    gradientTo: '#2A2210',
    image: `${BASE}/images/agents/gatekeeper.png`,
  },
];

export const pipelineSteps = [
  { label: 'Think', image: `${BASE}/images/pipeline/think.png`, agent: 'Thinker' },
  { label: 'Build', image: `${BASE}/images/pipeline/build.png`, agent: 'Creator' },
  { label: 'Check', image: `${BASE}/images/pipeline/check.png`, agent: 'Gatekeeper' },
  { label: 'Ship',  image: `${BASE}/images/pipeline/ship.png`,  agent: 'Admin' },
];

export const terminalContent = `# Task Handoff

- **From:** Thinker \u{1F9E0}
- **To:** Creator \u{1F3A8}
- **Priority:** urgent

## Task
Build the landing page from v7 spec

## Context
Design reference: microsoft.ai
Stack: Next.js 14 + Tailwind + Framer Motion`;
