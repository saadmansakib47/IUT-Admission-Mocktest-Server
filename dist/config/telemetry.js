import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { trace } from "@opentelemetry/api";
const traceExporter = new OTLPTraceExporter({
    url: "http://localhost:4317",
});
const metricReader = new PrometheusExporter({
    port: 9464,
}, () => {
    console.log("OpenTelemetry initialized, Prometheus scrape endpoint: http://localhost:9464/metrics");
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
export async function tracedAI(questionId, callAI) {
    const tracer = trace.getTracer("mocktest-backend");
    return tracer.startActiveSpan("AI Explanation", async (span) => {
        span.setAttribute("question.id", questionId);
        try {
            const result = await callAI();
            return result;
        }
        catch (err) {
            span.recordException(err);
            throw err;
        }
        finally {
            span.end();
        }
    });
}
