import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { trace } from "@opentelemetry/api";


const traceExporter = new OTLPTraceExporter({
    url: "http://localhost:4317",
});

const metricExporter = new OTLPMetricExporter({
    url: "http://localhost:9464/metrics",
});


const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000,
});

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [SemanticResourceAttributes.SERVICE_NAME]: "mocktest-backend",
    }),
    traceExporter,
    metricReader,
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();


export async function tracedAI(questionId: string, callAI: () => Promise<any>) {
    const tracer = trace.getTracer("mocktest-backend");
    return tracer.startActiveSpan("AI Explanation", async (span) => {
        span.setAttribute("question.id", questionId);

        try {
            const result = await callAI();
            return result;
        } catch (err) {
            span.recordException(err as Error);
            throw err;
        } finally {
            span.end();
        }
    });
}