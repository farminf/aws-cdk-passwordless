import { Stack, StackProps, Construct, App } from "@aws-cdk/core";
import { StringParameter } from "@aws-cdk/aws-ssm";
import { CdkPasswordless } from "../lib/index";

class myStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    const pless = new CdkPasswordless(this, "myPasswordLess", {
      mailSubject: "myStack - signIn",
      userPoolClientName: "myClientName",
      verifiedDomains: ["gmail.com"]
    });

    new StringParameter(this, "userPoolIdParam", {
      parameterName: "/cognito/userPoolId",
      stringValue: pless.userPool.userPoolId
    });
    new StringParameter(this, "userPoolClientIdParam", {
      parameterName: "/cognito/userPoolClientId",
      stringValue: pless.userPoolClient.userPoolClientId
    });
  }
}

new myStack(new App(), "my-stack");
