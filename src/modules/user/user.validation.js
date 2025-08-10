import { generalRuls } from "../../utils/generalRules/index.js";
import joi from 'joi';

export const authorizationSchema = {
    headers: generalRuls.headers.required()
};

export const idSchema = {
    params: joi
      .object({
        id: generalRuls.id.required(),
      })
      .required(),
  };

  export const getServiceByNameSchema = {
    query: joi
      .object({
        name: joi.string().trim().required(),
      })
      .required(),
  };

    export const orderSchema= {
    body: joi
      .object({
      description: joi.string().required(),
      serviceId: generalRuls.id.required(),
      deliveryDate: joi.date().greater(Date.now()).required(),
    }).required(),
    files: joi
    .object({
      image: joi.array().items(generalRuls.imageFile("image")),
    }),
    headers: generalRuls.headers.required()
  };

   export const confirmOrderSchema= {
    params: joi
      .object({
      id: generalRuls.id.required(),
    }).required(),
    headers: generalRuls.headers.required()
  };