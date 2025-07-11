import joi from "joi";
import {generalRuls} from "../../utils/generalRules/index.js";
export const addCategorySchema = {
    body: joi
      .object({
        title: joi.string().required(),
        description: joi.string().required(),
    }),
    files: joi
      .object({
        image: joi.array().items(generalRuls.imageFile("image")).required(),
      })
      .required()
    ,
  headers:generalRuls.headers.required()
};

export const getCategorySchema = {
    params: joi
      .object({
        id: generalRuls.id.required(),
      })
      .required(),
};

export const deleteCategorySchema = {
    params: joi
      .object({
        id: generalRuls.id.required(),
      })
      .required(),
      headers:generalRuls.headers.required()
};