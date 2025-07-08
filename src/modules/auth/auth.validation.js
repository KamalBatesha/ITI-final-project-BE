import joi from "joi";
import { genderTypes, generalRuls, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";

const currentDate = new Date();
const eighteenYearsAgo = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
export const signUpSchema = {
  body: joi
    .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: generalRuls.email.required(),
    password: generalRuls.password.required(),
    gender: joi.string().valid(...Object.values(genderTypes)).required(),
    DOB: joi.date()
        .max(eighteenYearsAgo) // Must be greater than 18 years ago
        .required(),
    phone: generalRuls.phone.required(),
    provider: joi.string().valid(...Object.values(providerTypes)),
    address: joi.string().required(),
    })
    .required(),
  files: joi
    .object({
      profilePic: joi.array().items(generalRuls.imageFile("profilePic")),
      identityPic: joi.array().items(generalRuls.imageFile("identityPic")),
    })
    .required(),
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
// export const refreshTokenSchema = {
//   headers:generalRuls.headers.required()
// };
