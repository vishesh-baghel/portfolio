import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Simulate processing time (remove this in production)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Placeholder responses based on common questions
    const response = generatePlaceholderResponse(message.toLowerCase());

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Portfolio agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generatePlaceholderResponse(message: string): string {
  // Simple keyword matching for placeholder responses
  if (message.includes('experience') || message.includes('background')) {
    return "Vishesh is a skilled software engineer with expertise in building AI agents, developer tools, and infrastructure. He has experience working with modern web technologies and has a strong focus on open-source contributions.";
  }
  
  if (message.includes('technologies') || message.includes('tech') || message.includes('skills')) {
    return "Vishesh works with a variety of modern technologies including TypeScript, React, Next.js, Node.js, and AI/ML frameworks. He's particularly passionate about building developer tools and AI agent systems.";
  }
  
  if (message.includes('projects') || message.includes('work')) {
    return "Vishesh has worked on several interesting projects including AI agent frameworks, developer tooling, and open-source contributions. You can check out his GitHub profile to see his latest work and contributions to the community.";
  }
  
  if (message.includes('contact') || message.includes('reach') || message.includes('connect')) {
    return "You can reach Vishesh through his LinkedIn, GitHub, or X (Twitter) profiles. He's always open to discussing interesting opportunities and collaborations in the AI and developer tools space.";
  }
  
  if (message.includes('unique') || message.includes('special') || message.includes('different')) {
    return "What makes Vishesh unique is his combination of strong technical skills with a passion for open-source development and building tools that help other developers. He focuses on creating practical solutions that solve real problems.";
  }
  
  if (message.includes('ai') || message.includes('agent') || message.includes('llm')) {
    return "Vishesh has significant expertise in AI agent development, working with LLMs, and building intelligent systems. He's particularly interested in the intersection of AI and developer productivity tools.";
  }
  
  // Default response
  return `Thanks for asking about "${message}"! I'm a placeholder agent right now, but I'd be happy to help you learn more about Vishesh's background, skills, and experience. Feel free to ask more specific questions about his work, technologies he uses, or how to get in touch with him.`;
}
