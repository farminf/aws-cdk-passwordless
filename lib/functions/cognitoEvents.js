const codeConfirmationEmailBody = ({
  codeParameter,
}) => `<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <title></title>

  <style type="text/css">
  </style>
</head>
<body style="margin:0; padding:0; background-color:#FFFFFF;">
  <center>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
            <td align="center" valign="top">

              <table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
                <tr>
                  <td align="center" valign="top" style="padding:10px;">


                    <table width="" cellpadding="0" cellspacing="0" border="0" class="container">
                      <tr>
                        <td height="30" style="font-size:30px; line-height:30px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="top" style="color:#5C5D71; font-family: 'Value', Arial, Helvetica, sans-serif; font-weight: bold; font-size: 16px; line-height: 1;">
                          Hey there!
                        </td>
                      </tr>
                      <tr>
                        <td height="5" style="font-size:5px; line-height:5px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td height="5" style="font-size:5px; line-height:5px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td height="30" style="font-size:30px; line-height:30px;">&nbsp;</td>
                      </tr>
                    </table>

                    <table width="" cellpadding="0" cellspacing="0" border="0" class="container">
                      <tr>
                        <td align="center" valign="top" style="color:#5C5D71; font-family: 'Value', Arial, Helvetica, sans-serif; font-weight: bold; font-size: 16px; line-height: 1;">
                          This is your
                        </td>
                      </tr>
                      <tr>
                        <td height="5" style="font-size:5px; line-height:5px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="top" style="color:#5C5D71; font-family: 'Value', Arial, Helvetica, sans-serif; font-weight: bold; font-size: 16px; line-height: 1;">
                          Confirmation Code:
                        </td>
                      </tr>
                      <tr>
                        <td height="30" style="font-size:30px; line-height:30px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" valign="top" style="color:#5C5D71; font-family: 'Value', Arial, Helvetica, sans-serif; font-weight: bold; font-size: 16px; line-height: 1;">
                          <span style="text-transform:uppercase; COLOR: #0E0E43; font-size: 32px;">${codeParameter}</span> <!-- HERE GOES THE CONFIRMATION CODE-->
                        </td>
                      </tr>
                      <tr>
                        <td height="30" style="font-size:30px; line-height:30px;">&nbsp;</td>
                      </tr>
                    </table>

                    <table width="" cellpadding="0" cellspacing="0" border="0" class="container">
                      <tr>
                        <td height="40" style="font-size:40px; line-height:40px;">&nbsp;</td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
        </tr>
    </table>
  </center>
</body>
</html>`;

module.exports.handler = async (event, context) => {
  console.log("event", JSON.stringify(event, null, 2));

  const verifiedDomains = process.env.VERIFIED_DOMAINS;
  const signInSubject = process.env.SIGNINSUBJECT && JSON.parse(process.env.SIGNINSUBJECT);


  if (event.triggerSource === "PreSignUp_SignUp") {
    const { email } = event.request.userAttributes;

    // domain verification
    const domain = email.replace(/.*@/, "");
    console.log("domain of email is", domain);
    if (verifiedDomains && verifiedDomains.indexOf(domain) < 0) {
      throw new Error(`Email address has unacceptable domain to be registered`);
    }

    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
  }

  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const { codeParameter } = event.request;

    event.response.emailSubject = `${signInSubject}` ||  "Passwordless App – Sign In";
    event.response.emailMessage = codeConfirmationEmailBody({
      codeParameter,
    });
  }

  console.log("response", event);
  return event;
};
