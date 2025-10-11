# Observability Setup for Portfolio Mastra Agents

## Overview

This project uses OpenTelemetry (OTEL) for tracing Mastra agent operations, integrated with Vercel's observability platform.

## What's Configured

### 1. Instrumentation File
**File**: `instrumentation.ts` (root level)

- Sets `globalThis.___MASTRA_TELEMETRY___ = true` to suppress Mastra warnings
- Registers Vercel's OTEL setup for automatic tracing
- Only runs on server-side (Node.js runtime)

### 2. Mastra Telemetry Config
**File**: `src/mastra/index.ts`

```typescript
telemetry: {
  serviceName: "portfolio-mastra",
  enabled: true,
}
```

### 3. Dependencies Installed
- `@vercel/otel` - Vercel's OpenTelemetry integration
- `@opentelemetry/api` - OpenTelemetry API
- `@mastra/fastembed` - Local embeddings for faster performance

## How It Works

### Automatic Tracing
When telemetry is enabled, Mastra automatically traces:

1. **Agent Operations**
   - Agent runs with full context
   - LLM calls with token usage
   - Tool executions
   - Memory operations (thread creation, semantic recall)

2. **Workflow Operations** (if you add workflows)
   - Workflow runs
   - Individual steps
   - Control flow

### Trace Data Flow
```
Agent/Workflow Execution
  ↓
Mastra creates spans
  ↓
OpenTelemetry SDK
  ↓
Vercel OTEL Exporter
  ↓
Vercel Observability Dashboard
```

## Viewing Traces

### On Vercel (Production/Preview)
1. Deploy to Vercel
2. Go to your project dashboard
3. Click "Observability" tab
4. View traces, spans, and performance metrics

### Locally (Development)
- Traces are created but not exported by default
- To view locally, you can:
  - Add `ConsoleExporter` to see traces in terminal
  - Use Mastra Playground (requires additional setup)
  - Configure external exporters (Langfuse, Braintrust, etc.)

## Retrieving Trace IDs

### In Agent Responses
```typescript
const result = await agent.generate({
  messages: [{ role: 'user', content: 'Hello' }]
});

console.log('Trace ID:', result.traceId);
```

### In API Routes
```typescript
// In your /api/portfolio-agent route
const response = await portfolioAgent.generate({ ... });

// Include trace ID in response for debugging
return NextResponse.json({
  ...response,
  traceId: response.traceId,
});
```

## Performance Impact

### Minimal Overhead
- Tracing adds ~5-15ms per request
- Async export doesn't block responses
- Sampling can reduce overhead in high-traffic scenarios

### Current Configuration
- **Sampling**: 100% (all traces collected)
- **Service Name**: `portfolio-mastra`
- **Exporters**: Vercel OTEL (automatic)

## Troubleshooting

### Warning: "Mastra telemetry is enabled, but instrumentation file was not loaded"
**During Build**: This warning appears during `next build` because the instrumentation hook only runs at runtime, not during static page generation. This is expected and safe to ignore.

**At Runtime**: ✅ Fixed by creating `instrumentation.ts` and setting the global flag. The warning will not appear when the app is running (dev or production).

### Warning: Database initialization issues
**Cause**: LibSQL file permissions or path issues.
**Solution**: 
- Ensure `.mastra` directory is writable
- Check `MASTRA_DB_FILE` environment variable if set
- Database files are created automatically on first run

### Traces Not Appearing
**Check**:
1. Telemetry is enabled in `src/mastra/index.ts`
2. `instrumentation.ts` exists at project root
3. `@vercel/otel` is installed
4. Deployed to Vercel (local traces need additional exporters)

### High Latency
**Current Optimizations**:
- Using `fastembed` for local embeddings (no network calls)
- Reduced semantic recall: `topK: 1, messageRange: 0`
- Thread-scoped recall (not resource-scoped)
- Last 10 messages only

**Further Optimizations**:
- Disable semantic recall entirely if not needed
- Use sampling to reduce trace volume
- Add custom processors to filter spans

## Advanced Configuration

### Adding Custom Exporters
To send traces to external platforms (Langfuse, Braintrust, etc.):

```typescript
// instrumentation.ts
import { LangfuseExporter } from '@mastra/langfuse';

export async function register() {
  (globalThis as any).___MASTRA_TELEMETRY___ = true;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { NodeSDK, ATTR_SERVICE_NAME, resourceFromAttributes } = 
      await import("@mastra/core/telemetry/otel-vendor");
    
    const exporter = new LangfuseExporter({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
    });

    const sdk = new NodeSDK({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "portfolio-mastra",
      }),
      traceExporter: exporter,
    });

    sdk.start();
  }
}
```

### Sampling Strategies
To reduce trace volume in production:

```typescript
// src/mastra/index.ts
telemetry: {
  serviceName: "portfolio-mastra",
  enabled: true,
  sampling: {
    type: 'ratio',
    probability: 0.1, // Sample 10% of traces
  },
}
```

### Custom Metadata
Add context to traces:

```typescript
// In your agent execution
execute: async ({ inputData, tracingContext }) => {
  tracingContext.currentSpan?.update({
    metadata: {
      userId: inputData.userId,
      endpoint: '/api/portfolio-agent',
      environment: process.env.NODE_ENV,
    }
  });
  
  return result;
}
```

## Environment Variables

### Required
- `OPENAI_API_KEY` - For agent LLM calls

### Optional
- `MASTRA_DB_FILE` - Override default database file path (defaults to `.mastra/db.sqlite` for dev, `.mastra/prod.sqlite` for prod)
- `VERCEL_ENV` - Automatically set by Vercel (production/preview/development)

### Observability-Specific (Optional)
- `LANGFUSE_PUBLIC_KEY` - If using Langfuse exporter
- `LANGFUSE_SECRET_KEY` - If using Langfuse exporter
- `BRAINTRUST_API_KEY` - If using Braintrust exporter

## Next Steps

1. **Deploy to Vercel** to see traces in production
2. **Add trace IDs to API responses** for debugging
3. **Set up alerts** in Vercel dashboard for errors/latency
4. **Consider external exporters** for advanced analytics
5. **Implement sampling** if trace volume becomes high

## Resources

- [Mastra AI Tracing Docs](https://mastra.ai/en/docs/observability/ai-tracing/overview)
- [Vercel OTEL Docs](https://vercel.com/docs/observability/otel-overview/quickstart)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [OpenTelemetry Docs](https://opentelemetry.io/docs/)

## Summary

✅ **Instrumentation file created** - Suppresses warnings, enables OTEL  
✅ **Telemetry enabled in Mastra** - Automatic tracing of agents  
✅ **Vercel OTEL integrated** - Traces sent to Vercel dashboard  
✅ **Dependencies installed** - `@vercel/otel`, `@opentelemetry/api`  
✅ **Performance optimized** - FastEmbed, reduced semantic recall  
✅ **Database warnings addressed** - Using simple connection string  

Your Mastra agents are now fully instrumented with OpenTelemetry tracing!
