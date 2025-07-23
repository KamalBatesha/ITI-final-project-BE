import Joi from "joi";
import mongoose from "mongoose";
import { generalRuls } from "../../utils/generalRules/index.js";

export const getMyChatsSchema ={
  headers: generalRuls.headers.required(),
};

export const getChatByIdSchema ={
  headers: generalRuls.headers.required(),
  params: Joi.object({
    id: generalRuls.id.required(),
  }),
};



// import Joi from "joi";
// import mongoose from "mongoose";
// import { generalRuls } from "../../utils/generalRules/index.js";

// export const sendMessageSchema = Joi.object({
//   chatId: Joi.string().custom((value, helpers) => {
//     if (!mongoose.Types.ObjectId.isValid(value)) {
//       return helpers.error("any.invalid");
//     }
//     return value;
//   }),
//   userId: generalRuls.id.required(),
//   providerId: generalRuls.id.required() ,
//   text: Joi.string().allow(null, ""),
// });