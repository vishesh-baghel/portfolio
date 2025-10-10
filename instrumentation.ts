export async function register() {
  // Set the global flag to suppress Mastra telemetry warning
  // This tells Mastra that we've loaded the instrumentation file
  (globalThis as any).___MASTRA_TELEMETRY___ = true;

  // Only run instrumentation on the server side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamically import Vercel's OTEL setup to avoid bundling issues
    const { registerOTel } = await import("@vercel/otel");

    // Register OpenTelemetry with Vercel
    registerOTel({
      serviceName: "portfolio-mastra",
    });
  }
}
