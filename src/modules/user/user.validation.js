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
    }).required(),
    headers: generalRuls.headers.required()
  };

   export const acceptOrderSchema= {
    params: joi
      .object({
      orderId: generalRuls.id.required(),
    }).required(),
    headers: generalRuls.headers.required()
  };