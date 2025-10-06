import { NextRequest } from 'next/server';
import { mastra } from '@/mastra';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Get the portfolio agent
          const agent = mastra.getAgent('portfolioAgent');
          
          // Stream the agent response
          const agentStream = await agent.stream([
            { role: 'user', content: message }
          ]);

          // Process the text stream
          for await (const chunk of agentStream.textStream) {
            // Send each chunk as SSE format
            const data = `data: ${JSON.stringify({ 
              type: 'chunk', 
              content: chunk,
              timestamp: new Date().toISOString()
            })}\n\n`;
            
            controller.enqueue(new TextEncoder().encode(data));
          }

          // Send completion signal
          const completion = `data: ${JSON.stringify({ 
            type: 'done',
            timestamp: new Date().toISOString()
          })}\n\n`;
          
          controller.enqueue(new TextEncoder().encode(completion));
          controller.close();

        } catch (error) {
          console.error('Streaming error:', error);
          
          // Send error as SSE
          const errorData = `data: ${JSON.stringify({ 
            type: 'error', 
            error: 'Failed to generate response',
            timestamp: new Date().toISOString()
          })}\n\n`;
          
          controller.enqueue(new TextEncoder().encode(errorData));
          controller.close();
        }
      }
    });

    // Return streaming response with SSE headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Portfolio agent error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
