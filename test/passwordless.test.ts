import { Stack, App } from "@aws-cdk/core";
import { CdkPasswordless } from "../lib/index";

test("testing passwordless resources", () => {
  const app = new App();
  const stack = new Stack(app, "test");
  const myPasswordlessTest = new CdkPasswordless(
    stack,
    "myPasswordlessTest",
    {}
  );

  expect(app.synth().getStack("test").template).toMatchSnapshot();
});
