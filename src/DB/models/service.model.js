import mongoose from "mongoose";
import { days } from "../../utils/generalRules/index.js";


const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true},
  description: { type: String, required: true, trim: true },
  mainImage: { secure_url: String, public_id: String },
  images: [{ secure_url: String, public_id: String }],
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  duration: { type: Number },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  days: [{ type: String, enum:[...days] }],
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isConfirmed: { type: Boolean, default: false },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

export const ServiceModel = mongoose.model.Service || mongoose.model("Service", serviceSchema);
