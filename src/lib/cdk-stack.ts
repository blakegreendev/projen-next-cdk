import * as amp from "@aws-cdk/aws-amplify";
import { BuildSpec } from "@aws-cdk/aws-codebuild";
import { Construct, Stack, StackProps, SecretValue } from "@aws-cdk/core";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const amplifyApp = new amp.App(this, "amplify", {
      appName: "sketchynote",
      sourceCodeProvider: new amp.GitHubSourceCodeProvider({
        owner: "blakegreendev",
        repository: "projen-next-cdk",
        oauthToken: SecretValue.secretsManager("github-repo"),
      }),
      buildSpec: BuildSpec.fromObjectToYaml({
        version: "1.0",
        frontend: {
          phases: {
            preBuild: {
              commands: ["cd frontend && yarn"],
            },
            build: {
              commands: ["yarn build"],
            },
          },
          artifacts: {
            baseDirectory: "build",
            files: "**/*",
          },
          cache: {
            paths: "frontend/node_modules/**/*",
          },
        },
      }),
    });

    amplifyApp.addBranch("main");
  }
}
