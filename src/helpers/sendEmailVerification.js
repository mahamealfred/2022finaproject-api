import { decode, encode } from "./jwtTokenizer";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

const sendEmailVerification= async({email})=>{
    const token = await encode({ email });
    const data = {
      from: "qualityeducationbooster@gmail.com",
      to: email,
      subject: "REB-QualityEducation Activation Email.",
      text: `
        Hello, Thanks for registering on our site.
        Please copy and past the address bellow to activate your account.
        http://${process.env.CLIENT_URL}/auth/activate-email/${token}
        `,
      html: `
        <h1>Hello ${fullname},</h1>
        <p>Thanks for registering on our site.</p>
        <p>Please click the link below to activate your account.</p>
        <a href="http://${process.env.CLIENT_URL}/auth/activate-email/${token}">Activate your account.</a>
        `,
    };
    try {
      sgMail.send(data, function (error, body) {
        console.log(body);
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent successful");
        }
      });
    } catch (error) {
      console.log("something want wrong ");
    }
}
export default sendEmailVerification;