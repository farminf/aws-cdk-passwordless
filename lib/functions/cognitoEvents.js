/* eslint-disable require-atomic-updates */
const AWS = require("aws-sdk");

module.exports.handler = async (event, context) => {
  console.log("event", JSON.stringify(event, null, 2));

  if (event.triggerSource === "PreSignUp_SignUp") {
      event.response.autoConfirmUser = true;
      event.response.autoVerifyEmail = true;
  }

  // if (event.triggerSource === "CustomMessage_ForgotPassword") {
  //   const { codeParameter } = event.request;

  //   event.response.emailSubject = `${companyName} Instant Feedback App – Sign In`;
  //   event.response.emailMessage = codeConfirmationEmailBody({
  //     materialBucketURL,
  //     codeParameter,
  //   });
  // }

  console.log("response", event);
  return event;
};
