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
    mobileNumber: generalRuls.phone.required(),
    provider: joi.string().valid(...Object.values(providerTypes))
    })
    .required(),
    address: joi.string().required(),
  files: joi
    .object({
      profilePic: joi.array().items(generalRuls.imageFile("profilePic")),
    })
    .required(),
};

export const confirmEmailSchema = {
  body: joi
    .object({
    email: generalRuls.email.required(),
    otp: joi.string().length(4).required()
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

export const loginWithGmailSchema = {
  body: joi
    .object({
      idToken: joi.string().required(),
    })
    .required(),
};
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
      email: generalRuls.email.required(),
      otp: joi.string().length(4).required(),
      newPassword: generalRuls.password.required(),
    })
    .required(),
};
export const refreshTokenSchema = {
  headers:generalRuls.headers.required()
};
