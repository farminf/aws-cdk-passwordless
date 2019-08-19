import { Stack, StackProps, Construct, App } from "@aws-cdk/core";
import { CdkPasswordless } from "../lib/index";

class myStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    const pless = new CdkPasswordless(this, "myPasswordLess", {
      mailSubject: "myStack - signIn",
      userPoolClientName: "myClientName",
      verifiedDomains: ["gmail.com"]
    });
  }
}

new myStack(new App(), "my-stack");
