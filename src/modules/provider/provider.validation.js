import joi from "joi";
import { days, genderTypes, generalRuls, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";
export const addWorkShopSchema = {
  body: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
    }),
  files: joi
    .object({
      mainImage: joi.array().items(generalRuls.imageFile("mainImage")).required(),
      images: joi.array().items(generalRuls.imageFile("images")).required(),
    })
    .required()
  ,
  headers: generalRuls.headers.required()
};

export const addServiceSchema = {
  body: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required(),
      duration: joi.number().required(),
      categoryId: generalRuls.id.required(),
      days: joi.custom((value, helpers) => {
        const data = JSON.parse(value);
        if (data.length > 0 && data.length <= days.length) {
          if (data.every((item) => days.includes(item))) return data;
          else return helpers.message("days is not valid");
        } else {
          return helpers.message("days is required");
        }
      })

    }),
  files: joi
    .object({
      mainImage: joi.array().items(generalRuls.imageFile("mainImage")).required(),
      images: joi.array().items(generalRuls.imageFile("images")).required(),
    })
    .required()
  ,
  headers: generalRuls.headers.required()
};
export const authorizationSchema = {
  headers: generalRuls.headers.required()
};
export const deleteWorlShopOrServiceSchema = {
  params: joi
    .object({
      id: generalRuls.id.required(),
    })
    .required(),
  headers: generalRuls.headers.required()
};