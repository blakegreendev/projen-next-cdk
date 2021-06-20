import * as amp from "@aws-cdk/aws-amplify";
import { Construct, Stack, StackProps, SecretValue } from "@aws-cdk/core";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const amplify = new amp.App(this, "amplify", {
      appName: "sketchynote",
      sourceCodeProvider: new amp.GitHubSourceCodeProvider({
        owner: "blakegreendev",
        repository: "projen-next-cdk",
        oauthToken: SecretValue.secretsManager("github-token"),
      }),
    });
  }
}
