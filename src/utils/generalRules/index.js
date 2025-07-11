import joi from "joi";
import { Types } from "mongoose";

const customId = (value, helper) => {
  const checkId = Types.ObjectId.isValid(value);
  return checkId ? value : helper.message(`${value} is not a valid id`);
};

export const generalRuls = {
  email: joi.string().email({ tlds: { allow: true } }),
  password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  id: joi.string().custom(customId),
  phone:joi.string().regex(/^01[0-2,5]{1}[0-9]{8}$/),
  headers: joi.object({
    authorization: joi.string().required(),
    "cache-control": joi.string(),
    "postman-token": joi.string(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
  }),
  image: ["image/png", "image/peg", "image/gif", "image/jpeg"],
  video: ["video/mp4"],
  audio: ["audio/mp3"],
  pdf: ["application/pdf"],
  imageFile: (fieldname) =>
    joi.object({
      size: joi.number().positive().required(),
      path: joi.string().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      mimetype: joi.string().required(),
      encoding: joi.string().required(),
      originalname: joi.string().required(),
      fieldname: joi.string().valid(fieldname).required(),
    }),
};

export const genderTypes = {
  male: "male",
  female: "female",
};
export const rolesTypes={
  user:"user",
  admin:"admin",
  provider:"provider"
}
export const providerTypes={
  google:"google",
  system:"system"
}
export const days=[
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"]