export interface WorkEntry {
  id: string;
  client: string;
  projectTitle: string;
  description: string;
  techStack: string[];
  outcomes: string[];
  link?: string;
  images?: string[];
}

export const workEntries: WorkEntry[] = [
  {
    id: 'placeholder-project-1',
    client: 'Tech Startup Inc.',
    projectTitle: 'AI-Powered Analytics Dashboard',
    description: 'Built a real-time analytics dashboard with AI-driven insights for business intelligence. Integrated multiple data sources and implemented custom visualization components.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Mastra', 'OpenAI API', 'TailwindCSS'],
    outcomes: [
      'Reduced data processing time by 60%',
      'Improved user engagement by 45%',
      'Successfully deployed to 10k+ users',
    ],
    link: '#',
  },
  // Add more work entries here
];
