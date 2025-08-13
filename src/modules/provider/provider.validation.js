import joi from "joi";
import { days, genderTypes, generalRuls, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";
export const addWorkShopSchema = {
  body: joi
    .object({
      title: joi.string(),
      description: joi.string(),
    }),
  files: joi
    .object({
      mainImage: joi.array().items(generalRuls.imageFile("mainImage")).required(),
      images: joi.array().items(generalRuls.imageFile("images")),
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
      minPrice: joi.number().required(),
      maxPrice: joi.number().greater(joi.ref("minPrice")).required(),
      duration: joi.number(),
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
      images: joi.array().items(generalRuls.imageFile("images")),
    })
  ,
  headers: generalRuls.headers.required()
};
export const updateServiceSchema = {
  body: joi
    .object({
      title: joi.string(),
      description: joi.string(),
      minPrice: joi.number(),
      maxPrice: joi.number().greater(joi.ref("minPrice")),
      duration: joi.number(),
      // categoryId: generalRuls.id,
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
  params: joi
    .object({
      id: generalRuls.id.required(),
    })
    .required(),
  files: joi
    .object({
      mainImage: joi.array().items(generalRuls.imageFile("mainImage")),
      images: joi.array().items(generalRuls.imageFile("images")),
    })
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

export const acceptOrRejectOrderSchema = {
  body: joi
    .object({
    status: joi.string().valid("accepted", "rejected").required(),
    orderId: generalRuls.id.required(),
  }),
  headers: generalRuls.headers.required()
};
export const orderDatailsSchema = {
  body: joi
    .object({
    price: joi.number().required(),
  deliveryDate: joi.date().required(),
  address: joi.string().required(),
  comment: joi.string().trim().required(),
  }),
  headers: generalRuls.headers.required(),
  params: joi
    .object({
      id: generalRuls.id.required(),
    })
    .required(),
};