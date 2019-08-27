# AWS CDK PasswordLess Construct

An AWS CDK construct for creating passwordless authentication resources on AWS.
This Construct will create following resources with their configuration:

- Cognito User Pool
- Cognito Pool Client
- Cognito Lambda Trigger

# Usage

```bash
yarn add aws-cdk-passwordless
```

```js
import { CdkPasswordless } from "aws-cdk-passwordless";


new CdkPasswordless(this, "myPasswordLess", {
  mailSubject: "myStack - signIn", // subject of the mail arriving with code to confirm
  userPoolClientName: "myClientName",
  verifiedDomains: ["gmail.com"], // emails with the domains that are allow to signup
  postConfirmationLambda: lambda.Function(...) // passing a lambda which will be triggered after code confirmation
});
```

# note

There is a sample folder showing how to deploy a stack using this construct.
Additionally, There is a very simple Web Demo Client which shows how passwordless authentication can be done on the client side. It uses AWS Amplify.

# License

MIT

# Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
