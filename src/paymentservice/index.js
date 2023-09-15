/*
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';


if(process.env.DISABLE_PROFILER) {
  console.log("Profiler disabled.")
}
else {
  console.log("Profiler enabled.")
  require('@google-cloud/profiler').start({
    serviceContext: {
      service: 'paymentservice',
      version: '1.0.0'
    }
  });
}

// Register GRPC OTel Instrumentation for trace propagation
// regardless of whether tracing is emitted.
const { GrpcInstrumentation } = require('@opentelemetry/instrumentation-grpc');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

registerInstrumentations({
  instrumentations: [new GrpcInstrumentation()]
});

if(process.env.ENABLE_TRACING == "1") {
  console.log("Tracing enabled.")
  const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
  const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
  const { OTLPTraceExporter } = require("@opentelemetry/exporter-otlp-grpc");
  const { Resource } = require('@opentelemetry/resources');
  const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

  const collectorUrl = process.env.COLLECTOR_SERVICE_ADDR
  const serviceName = process.env.OTEL_SERVICE_NAME
  const serviceNamespace = process.env.OTEL_SERVICE_NAMESPACE
  const containerId = process.env.CONTAINER_ID

  const resources = new Resource({
    [ SemanticResourceAttributes.SERVICE_NAME ]: serviceName,
    [ SemanticResourceAttributes.SERVICE_NAMESPACE ]: serviceNamespace,
    [ SemanticResourceAttributes.SERVICE_VERSION ]: "1.0.0",
    [ SemanticResourceAttributes.SERVICE_INSTANCE_ID ]: containerId,
  })

  const provider = new NodeTracerProvider({resource:resources});
  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({url: collectorUrl})));
  provider.register();
}
else {
  console.log("Tracing disabled.")
}


const path = require('path');
const HipsterShopServer = require('./server');

const PORT = process.env['PORT'];
const PROTO_PATH = path.join(__dirname, '/proto/');

const server = new HipsterShopServer(PROTO_PATH, PORT);

server.listen();
