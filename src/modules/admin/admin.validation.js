import joi from "joi";
import {generalRuls} from "../../utils/generalRules/index.js";
export const confirmAccountSchema = {
  params: joi
    .object({
      id: generalRuls.id.required(),
    })
  ,
  headers: generalRuls.headers.required()
};

export const authorizationSchema={
  headers: generalRuls.headers.required(),
}