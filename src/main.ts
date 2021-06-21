import { App } from "@aws-cdk/core";
import { CdkStack } from "./lib/cdk-stack";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();
new CdkStack(app, `CdkStack`, { env: devEnv });
app.synth();
