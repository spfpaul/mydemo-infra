#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { MydemoInfraPipelineStack } from '../lib/mydemoinfra-pipeline-stack';

const app = new cdk.App();
new MydemoInfraPipelineStack(app, 'MydemoinfraPipelineStack', {
  env: { account: '933673036381', region: 'us-east-1' },
});

app.synth();
