import { NextResponse } from 'next/server';
import { portfolioUrl, email, githubUsername } from '@/lib/site-config';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// This will be cached at build time for better performance
export const dynamic = 'force-static';

interface ExperimentMeta {
  title: string;
  description: string;
  category: string;
  slug: string;
}

function getExperiments(): ExperimentMeta[] {
  const experimentsDir = path.join(process.cwd(), 'src/content/experiments');
  
  try {
    const files = fs.readdirSync(experimentsDir);
    const experiments = files
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const slug = file.replace('.mdx', '');
        const filePath = path.join(experimentsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        
        return {
          title: data.title || slug,
          description: data.description || '',
          category: data.category || 'general',
          slug,
        };
      });
    
    return experiments;
  } catch (error) {
    console.error('Error reading experiments:', error);
    return [];
  }
}

export async function GET() {
  const experiments = getExperiments();
  
  // Group experiments by category
  const experimentsByCategory = experiments.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = [];
    }
    acc[exp.category].push(exp);
    return acc;
  }, {} as Record<string, ExperimentMeta[]>);

  const llmsContent = `# Vishesh Baghel - Portfolio

> Software engineer specializing in AI agents, vector systems, and full-stack development. Building production-ready integrations with TypeScript, React, Next.js, and modern AI tooling. Open source contributor to Mastra.ai and other frameworks.

I work with TypeScript, React, Next.js, Node.js, Spring Boot, PostgreSQL, and vector databases. I contribute to open source frameworks and take on selective freelance work—shipping MVPs, hardening infrastructure, and integrating AI into real products.

## About

- [About Me](${portfolioUrl}): Overview of skills, experience, and current work
- [Client Work](${portfolioUrl}/work): Past projects and collaborations
- [Open Source Contributions](https://github.com/${githubUsername}): Active contributions to Mastra.ai and other frameworks
- [Contact](mailto:${email}): Get in touch for consulting or collaboration

## Experiments & Technical Writing

${Object.entries(experimentsByCategory)
  .map(([category, exps]) => {
    const categoryTitle = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `### ${categoryTitle}\n${exps
      .map(exp => `- [${exp.title}](${portfolioUrl}/experiments/${exp.slug}): ${exp.description}`)
      .join('\n')}`;
  })
  .join('\n\n')}

## MCP Server

- [Experiments MCP Server](${portfolioUrl}/mcp): Access production-ready code patterns directly in your IDE
- [NPM Package](https://www.npmjs.com/package/vishesh-experiments): Install via npx for Cursor, Windsurf, or Claude

## Technical Stack

- **Languages**: TypeScript, JavaScript, Java
- **Frontend**: React, Next.js, HTML/CSS, TailwindCSS
- **Backend**: Node.js, Express.js, Spring Boot, Microservices
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis, Vector DBs (Milvus, LanceDB, ConvexDB)
- **Cloud & DevOps**: AWS (Lambda, SQS, S3, RDS, Cognito), Docker, Git
- **AI Tooling**: Mastra, Vector databases, AI agent development, LLM pipelines
- **Testing**: Jest, Vitest, JUnit5, Mockito, TDD/BDD

## Projects

- [Kestra Agent](https://github.com/vishesh-baghel/kestra-agent): AI-powered workflow builder converting natural language to Kestra YAML
- [Glidee Bot](https://github.com/vishesh-baghel/glide): AI code review assistant with 85% risk prediction accuracy
- [Docs Chatbot](https://github.com/vishesh-baghel/docs-chatbot): Deploy chatbots that understand your documentation
- [Kestra MCP Server](https://github.com/vishesh-baghel/kestra-mcp-doc-server): MCP documentation server utilities

## Optional

- [LinkedIn](https://www.linkedin.com/in/vishesh-baghel/): Professional profile and connections
- [Twitter/X](https://x.com/VisheshBaghell): Updates and technical insights
- [Calendar](https://cal.com/vishesh-baghel/15min): Book a 15-minute consultation
`;

  return new NextResponse(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
