// Set the global flag IMMEDIATELY (synchronously) before any async operations
// This must happen before Mastra initializes to suppress the warning
(globalThis as any).___MASTRA_TELEMETRY___ = true;

export async function register() {
  // Only run OpenTelemetry instrumentation in production
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "production"
  ) {
    // Import OpenTelemetry SDK components
    const { NodeSDK } = await import("@opentelemetry/sdk-node");
    const { getNodeAutoInstrumentations } = await import(
      "@opentelemetry/auto-instrumentations-node"
    );
    const { OTLPTraceExporter } = await import(
      "@opentelemetry/exporter-trace-otlp-http"
    );

    // Create OTLP exporter (Vercel will configure endpoint via env vars)
    const traceExporter = new OTLPTraceExporter();

    // Initialize OpenTelemetry SDK
    const sdk = new NodeSDK({
      serviceName: "portfolio-mastra",
      traceExporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          // Disable instrumentations that require packages we don't use
          "@opentelemetry/instrumentation-winston": {
            enabled: false,
          },
          "@opentelemetry/instrumentation-bunyan": {
            enabled: false,
          },
        }),
      ],
    });

    // Start the SDK
    sdk.start();

    // Graceful shutdown on process termination
    process.on("SIGTERM", () => {
      sdk
        .shutdown()
        .then(() => console.log("Tracing terminated"))
        .catch((error) => console.log("Error terminating tracing", error))
        .finally(() => process.exit(0));
    });
  }
}