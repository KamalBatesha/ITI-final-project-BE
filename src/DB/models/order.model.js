import mongoose from "mongoose";
import { days } from "../../utils/generalRules/index.js";

const status=["pending","accepted","rejected","completed","canceled","confirmed"]
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: status, default: "pending" },
  description: { type: String, required: true, trim: true },
  image: { secure_url: String, public_id: String },
  price: { type: Number },
  deliveryDate: { type: Date },
  address: { type: String, trim: true },
  paymentMethod: { type: String, trim: true },
  comment: { type: String, trim: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
orderSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});
orderSchema.virtual("service", {
  ref: "Service",
  localField: "serviceId",
  foreignField: "_id",
});
orderSchema.virtual("provider", {
  ref: "User",
  localField: "providerId",
  foreignField: "_id",
});

export const OrderModel = mongoose.model.Order || mongoose.model("Order", orderSchema);
