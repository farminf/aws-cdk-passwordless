# AWS CDK PasswordLess Construct

An AWS CDK construct for creating passwordless authentication resources on AWS.
This Construct will create following resources with their configuration:

- Cognito User Pool
- Cognito Pool Client
- Cognito Lambda Trigger

# Usage

```js
new CdkPasswordless(this, "myPasswordLess", {
  mailSubject: "myStack - signIn",
  userPoolClientName: "myClientName",
  verifiedDomains: ["gmail.com"],
  postConfirmationLambda: lambda.Function(...)
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
