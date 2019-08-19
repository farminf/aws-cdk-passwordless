import * as path from "path";
import cdk = require("@aws-cdk/core");
import cognito = require("@aws-cdk/aws-cognito");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");

export interface CdkPasswordlessProps {
  userPoolClientName?: string;
  verifiedDomains?: Array<string>;
  mailSubject?: string;
}

export class CdkPasswordless extends cdk.Construct {
  /** @returns the ARN of the SQS queue */
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: CdkPasswordlessProps = {}
  ) {
    super(scope, id);

    const { userPoolClientName, verifiedDomains, mailSubject } = props;

    const lambdaRole = new iam.Role(this, "lambdaRole", {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("lambda.amazonaws.com"),
        new iam.ServicePrincipal("cognito-idp.amazonaws.com")
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        )
      ]
    });

    const cognitoEventsLambda = new lambda.Function(
      this,
      "cognitoEventsLambda",
      {
        code: lambda.Code.asset(path.resolve(__dirname, "functions")),
        description:
          "This function auto-confirms users and their email addresses during sign-up",
        handler: "cognitoEvents.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        role: lambdaRole,
        environment: {
          VERIFIED_DOMAINS: JSON.stringify(verifiedDomains) || undefined,
          SIGNINSUBJECT: mailSubject || undefined
        }
      }
    );

    const userPool = new cognito.UserPool(this, "userPool", {
      lambdaTriggers: {
        preSignUp: cognitoEventsLambda
      },
      autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL],
      signInType: cognito.SignInType.EMAIL
    });

    const userPoolClient = new cognito.UserPoolClient(this, "userPoolClient", {
      userPoolClientName: userPoolClientName || "passwordless",
      generateSecret: false,
      userPool: userPool
    });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;

    new cdk.CfnOutput(this, "userPoolIdOutput", {
      exportName: "passwordLessUserPoolId",
      value: this.userPool.userPoolId
    });
    new cdk.CfnOutput(this, "userPoolArnOutput", {
      exportName: "passwordLessUserPoolArn",
      value: this.userPool.userPoolArn
    });
    new cdk.CfnOutput(this, "userPoolClientIdOutput", {
      exportName: "passwordLessUserPoolClientId",
      value: this.userPoolClient.userPoolClientId
    });
  }
}
