import { Stack, StackProps, Construct, App, Duration } from "@aws-cdk/core";
import { StringParameter } from "@aws-cdk/aws-ssm";
import { CdkPasswordless } from "../lib/index";
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";

class myStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    const postConfirmation = new Function(this, "postConfirmation", {
      runtime: Runtime.NODEJS_10_X,
      code: Code.fromAsset("./functions"),
      handler: "postConfirm.handler"
    });
    const pless = new CdkPasswordless(this, "myPasswordLess", {
      mailSubject: "myStack - signIn",
      userPoolClientName: "myClientName",
      verifiedDomains: ["gmail.com"],
      postConfirmationLambda: postConfirmation
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
