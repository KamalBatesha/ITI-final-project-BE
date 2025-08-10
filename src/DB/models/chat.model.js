import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  messages: [
    {
      content: {type:String},
      image: { secure_url: String, public_id: String },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

chatSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});
chatSchema.virtual("provider", {
  ref: "User",
  localField: "providerId",
  foreignField: "_id",
});

export const ChatModel = mongoose.model("Chat", chatSchema);
