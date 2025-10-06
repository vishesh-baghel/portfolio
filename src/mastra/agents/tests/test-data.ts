/**
 * Test data for portfolio agent evaluations
 * Covers various scenarios: technical questions, lead qualification, contact info, edge cases
 */

export interface TestCase {
  input: string;
  expectedTopics?: string[];
  shouldMentionContact?: boolean;
  shouldQualifyLead?: boolean;
  category: 'technical' | 'projects' | 'lead-qualification' | 'contact' | 'edge-case' | 'oss';
}

export const TEST_CASES: TestCase[] = [
  // Technical Skills Questions
  {
    input: "What technologies does Vishesh work with?",
    expectedTopics: ['TypeScript', 'React', 'AWS', 'Java', 'Node.js'],
    category: 'technical',
  },
  {
    input: "Does Vishesh have experience with microservices?",
    expectedTopics: ['microservices', '18 cloud-native', 'AWS', 'distributed'],
    category: 'technical',
  },
  {
    input: "Tell me about Vishesh's AWS experience",
    expectedTopics: ['AWS', 'Lambda', 'S3', 'RDS', 'SQS', 'cloud-native'],
    category: 'technical',
  },
  {
    input: "What databases does Vishesh know?",
    expectedTopics: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Vector'],
    category: 'technical',
  },
  {
    input: "Does Vishesh have AI/ML experience?",
    expectedTopics: ['AI', 'vector', 'LLM', 'agent', 'embeddings'],
    category: 'technical',
  },

  // Open Source Contributions
  {
    input: "What open source work has Vishesh done?",
    expectedTopics: ['Mastra', 'LanceDB', 'MilvusDB', 'vector database'],
    category: 'oss',
  },
  {
    input: "Tell me about Vishesh's Mastra contributions",
    expectedTopics: ['Mastra', 'LanceDB', 'MilvusDB', 'PR #3324', 'integrations'],
    category: 'oss',
  },

  // Projects
  {
    input: "What projects has Vishesh built?",
    expectedTopics: ['Glidee Bot', 'code review', 'AI', 'ML pipeline'],
    category: 'projects',
  },
  {
    input: "Tell me about Glidee Bot",
    expectedTopics: ['code review', '85% accuracy', '30%', 'GitHub'],
    category: 'projects',
  },

  // Lead Qualification Scenarios
  {
    input: "I need help integrating Mastra with PostgreSQL",
    shouldQualifyLead: true,
    shouldMentionContact: true,
    expectedTopics: ['integration', 'Mastra', 'PostgreSQL', 'consultation'],
    category: 'lead-qualification',
  },
  {
    input: "We're looking for a developer to build AI agents",
    shouldQualifyLead: true,
    shouldMentionContact: true,
    expectedTopics: ['AI agent', 'consultation', 'email'],
    category: 'lead-qualification',
  },
  {
    input: "Can you help us migrate our microservices to AWS?",
    shouldQualifyLead: true,
    shouldMentionContact: true,
    expectedTopics: ['microservices', 'AWS', 'migration', 'consultation'],
    category: 'lead-qualification',
  },
  {
    input: "I'm building with Mastra and need custom integrations",
    shouldQualifyLead: true,
    shouldMentionContact: true,
    expectedTopics: ['Mastra', 'integration', 'custom'],
    category: 'lead-qualification',
  },

  // Contact Information
  {
    input: "How can I contact Vishesh?",
    shouldMentionContact: true,
    expectedTopics: ['email', 'visheshbaghel99@gmail.com'],
    category: 'contact',
  },
  {
    input: "What's Vishesh's email?",
    shouldMentionContact: true,
    expectedTopics: ['visheshbaghel99@gmail.com'],
    category: 'contact',
  },
  {
    input: "Where can I see Vishesh's work?",
    shouldMentionContact: true,
    expectedTopics: ['experiments', 'visheshbaghel.com', 'GitHub'],
    category: 'contact',
  },

  // Edge Cases
  {
    input: "What's the weather like?",
    category: 'edge-case',
  },
  {
    input: "Tell me a joke",
    category: 'edge-case',
  },
  {
    input: "What's your favorite color?",
    category: 'edge-case',
  },
  {
    input: "Can Vishesh help me with my homework?",
    category: 'edge-case',
  },
];

// Expected behavior patterns
export const EXPECTED_BEHAVIORS = {
  // Should always be professional and concise
  maxResponseLength: 500, // characters for most responses
  
  // Should not hallucinate these things
  forbiddenClaims: [
    'PhD',
    'Stanford',
    'Google',
    'Meta',
    'senior architect',
    '10 years experience',
    'CTO',
  ],
  
  // Should mention these for contact
  contactInfo: {
    email: 'visheshbaghel99@gmail.com',
    website: 'visheshbaghel.com',
    github: 'github.com/vishesh-baghel',
    linkedin: 'linkedin.com/in/vishesh-baghel',
  },
  
  // Lead qualification triggers
  leadTriggers: [
    'need help',
    'looking for',
    'building with',
    'integrate',
    'migrate',
    'consulting',
  ],
};
