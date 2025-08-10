import mongoose from "mongoose";
import { Hash } from "../../utils/hash/index.js";
import { Decrypt, Encrypt } from "../../utils/encrypt/index.js";
import { genderTypes, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";


const workShopSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:{type: String},
    description:{type: String},
    mainImage:{type:{secure_url: String, public_id: String},required: true},
    images:[{secure_url: String, public_id: String}],
    deletedBy:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    isConfirmed:{type: Boolean, default: false},
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

export const WorkShopModel = mongoose.model.WorkShop || mongoose.model("WorkShop", workShopSchema);
