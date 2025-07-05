import { EventEmitter } from "events";
import { customAlphabet } from "nanoid";
import { UserModel } from "../../DB/models/index.js";
import { Hash } from "../hash/index.js";
import { sendEmail } from "./sendEmail.js";
import { emailHtml } from "./templet-email.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmailConfirmation", async ({ email }) => {
  await sendEmailToken({email,type:"confirmEmail",subject:"confirm email",message:"Email Confirmation"});
});
eventEmitter.on("forgetPassword", async ({ email }) => {
  // await sendOtp({email,type:"forgetPassword",subject:"forget password",message:"Forget Password"});

});
// eventEmitter.on("sendNewEmailConfirmation", async (data) => {
//   const { email,id } = data;
//   const otp=customAlphabet("0123456789",4)();
//   // hash otp
//   const hashedOtp = await Hash({key:otp,SALT_ROUNDS : process.env.SALT_ROUNDS});
//   await UserModel.updateOne({tempEmail:email,_id:id},{optNewEmail:hashedOtp})
//   await sendEmail(email,"confirm email",emailHtml({otp,message:"Email Confirmation"}));
// });



async function sendEmailToken({email,type,subject,message}){
  // const token=
  
  await sendEmail(email,subject,emailHtml({otp:otpCode,message}));

}