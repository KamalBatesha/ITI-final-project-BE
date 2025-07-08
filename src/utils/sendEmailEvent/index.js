import { EventEmitter } from "events";
// import { customAlphabet } from "nanoid";
// import { UserModel } from "../../DB/models/index.js";
// import { Hash } from "../hash/index.js";
import { sendEmail } from "./sendEmail.js";
import { emailHtml } from "./templet-email.js";
import { generateToken } from "../token/generateToken.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmailConfirmation", async ({ email }) => {
  await sendEmailToken({email,subject:"confirm email",message:"Email Confirmation",mainLink:"http://localhost:3000/auth/confirmEmail"});
});
eventEmitter.on("forgetPassword", async ({ email }) => {
  await sendEmailToken({email,subject:"reset password",message:"reset password",mainLink:""});//add mainLink to reset password page

});
// eventEmitter.on("sendNewEmailConfirmation", async (data) => {
//   const { email,id } = data;
//   const otp=customAlphabet("0123456789",4)();
//   // hash otp
//   const hashedOtp = await Hash({key:otp,SALT_ROUNDS : process.env.SALT_ROUNDS});
//   await UserModel.updateOne({tempEmail:email,_id:id},{optNewEmail:hashedOtp})
//   await sendEmail(email,"confirm email",emailHtml({otp,message:"Email Confirmation"}));
// });



async function sendEmailToken({email,subject,message,mainLink}){
  console.log("SIGNATURE_TOKEN_EMAIL",process.env.SIGNATURE_TOKEN_EMAIL);
  const token=await generateToken({payload:{email},SIGNATURE:process.env.SIGNATURE_TOKEN_EMAIL,option:{expiresIn:"1h"}});
  
  const html=emailHtml({link:`${mainLink}/${token}`,message})
  
  await sendEmail(email,subject,html);
}