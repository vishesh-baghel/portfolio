export interface WorkEntry {
  id: string;
  client: string;
  projectTitle: string;
  description: string;
  techStack: string[];
  outcomes: string[];
  link?: string;
  images?: string[];
  logo?: string; // optional path under public/ for client logo
}

export const workEntries: WorkEntry[] = [ 
  {
    id: 'artifact-engineering-inc',
    client: 'Artifact Engineering Inc.',
    projectTitle: 'AI agent for real-time diagram editing',
    description:
      'Delivered an MVP of a diagram-editing agent that accepts natural language prompts and performs real-time changes on electrical system diagrams. Built a custom chat UI, integrated a Mastra agent via CedarOS, and executed tool calls on the frontend to mutate the canvas (devices, nets, annotations) with optimistic updates and safety checks. Implemented Supabase Auth with role-based access and a minimal PostgreSQL schema for sessions, prompts, and operation logs.',
    techStack: [
      'Next.js',
      'TypeScript',
      'CedarOS',
      'Mastra',
      'PostgreSQL',
      'Supabase Auth',
      'TailwindCSS'
    ],
    outcomes: [
      'Shipped the first integrated version of the agent into the product as an MVP',
      'End‑to‑end prompt → tool‑call → diagram change flow demonstrated in a staging environment',
      'Defined tool schemas and guardrails for safe canvas mutations and undo/redo hooks',
      'Established structure for audit logs and observability of agent actions',
    ],
    link: 'https://www.artifact.engineer/',
    logo: '/clients/artifact.ico',
  },
];
