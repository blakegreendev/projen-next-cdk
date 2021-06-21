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
            baseDirectory: "frontend/.next",
            files: "**/*",
          },
          cache: {
            paths: "frontend/node_modules/**/*",
          },
        },
        appRoot: "dynamic-routing",
      }),
    });

    const main = amplifyApp.addBranch("main");
    const domain = amplifyApp.addDomain("sketchy.blakegreen.dev", {
      enableAutoSubdomain: true, // in case subdomains should be auto registered for branches
      autoSubdomainCreationPatterns: ["*", "pr*"], // regex for branches that should auto register subdomains
    });
    domain.mapRoot(main); // map master branch to domain root
    amplifyApp.addCustomRule({
      source: "/<*>",
      target: "/404.html",
      status: amp.RedirectStatus.NOT_FOUND_REWRITE,
    });
  }
}
