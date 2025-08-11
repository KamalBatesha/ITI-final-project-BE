import joi from "joi";
import { genderTypes, generalRuls, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";

const currentDate = new Date();
const eighteenYearsAgo = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
export const signUpSchema = {
  body: joi
    .object({
    name: joi.string().required(),
    email: generalRuls.email.required(),
    password: generalRuls.password.required(),
    rePassword: joi.string().valid(joi.ref("password")).required(),
    phone: generalRuls.phone.required(),
    provider: joi.string().valid(...Object.values(providerTypes)),
    address: joi.string().required(),
    role: joi.string().valid(...Object.values([rolesTypes.user, rolesTypes.provider])).required(),
    aboutMe: joi.string().min(15),
    profession:generalRuls.id
    })
    ,
  files: joi
    .object({
      profilePic: joi.array().items(generalRuls.imageFile("profilePic")),
      identityPic: joi.array().items(generalRuls.imageFile("identityPic")),
    })
    
};

export const confirmEmailSchema = {
  params: joi
    .object({
    token: joi.string().required(),
    })
    .required(),
};
export const signInSchema = {
  body: joi
    .object({
    email: generalRuls.email.required(),
    password: generalRuls.password.required(),
    })
    .required(),
};

// export const loginWithGmailSchema = {
//   body: joi
//     .object({
//       idToken: joi.string().required(),
//     })
//     .required(),
// };
export const forgetPasswordSchema = {
  body: joi
    .object({
      email: generalRuls.email.required(),
    })
    .required(),
};
export const resetPasswordSchema = {
  body: joi
    .object({
      password: generalRuls.password.required(),
      confirmPassword: joi.string().valid(joi.ref("password")).required(),
    })
    .required(),
  headers:generalRuls.headers.required()
};
export const refreshTokenSchema = {
  headers:generalRuls.headers.required()
};
export const ResendConfirmEmailSchema={
  params: joi
    .object({
      email: generalRuls.email.required(),
    })
    .required(),
}