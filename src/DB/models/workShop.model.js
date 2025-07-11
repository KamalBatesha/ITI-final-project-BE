import mongoose from "mongoose";
import { Hash } from "../../utils/hash/index.js";
import { Decrypt, Encrypt } from "../../utils/encrypt/index.js";
import { genderTypes, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";


const workShopSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:[{
    title:{type: String, required: true},
    description:{type: String, required: true},
    mainImage:{secure_url: String, public_id: String},
    images:[{secure_url: String, public_id: String}],
    isDeleted:{type: Boolean, default: false},
    isConfimed:{type: Boolean, default: false},
    confirmedBy:{type: mongoose.Schema.Types.ObjectId, ref: "User"}
  }]
  
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

export const WorkShopModel = mongoose.model.WorkShop || mongoose.model("WorkShop", workShopSchema);
