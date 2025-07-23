import mongoose from "mongoose";
import { Hash } from "../../utils/hash/index.js";
import { Decrypt, Encrypt } from "../../utils/encrypt/index.js";
import { genderTypes, providerTypes, rolesTypes } from "../../utils/generalRules/index.js";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true , trim: true },
  isEmailVerified: { type: Boolean, default: false },
  password: {
    type: String,
    required: function () {
      return this.provider == providerTypes.system;
    },
    minLength: 8,
    trim: true,
  },
  profession: { type: String, trim: true ,
    required: function () {
      return this.role == rolesTypes.provider; ;
    },
   },
  provider: { type: String, enum: Object.values(providerTypes), required: true, default: providerTypes.system },
  gender: { type: String, enum: Object.values(genderTypes), required: true },
  DOB: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return value < today && value <= minDate;
      },
      message: "Date of Birth must be a valid date in the past and at least 18 years ago."
    }
  },
  phone: {
    type: String, required: true, unique: true, trim: true, validate: {
        validator: function (value) {
          const regex = /^01[0-2,5]{1}[0-9]{8}$/;
          return regex.test(value);
        },
        message: "phone is not valid"
      }},
      isPhoneVerified: { type: Boolean, default: false },
  role: { type: String, enum: Object.values(rolesTypes), required: true, default: rolesTypes.user },
  address: { type: String, required: true, trim: true },
  isConfirmed: { type: Boolean, default: false },
  deletedAt: { type: Date },
  bannedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changeCredentialTime: { type: Date },
  profilePic: { secure_url: String, public_id: String },
  identityPic: [{
    secure_url: String, public_id: String
  }],
  phoneOTP:{type: String},
  deletedAt: { type: Date },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
userSchema.virtual("services",{
  ref:"Service",
  localField:"_id",
  foreignField:"providerId"
})
userSchema.virtual("workshops",{
  ref:"WorkShop",
  localField:"_id",
  foreignField:"providerId"
})
// Virtual Field
userSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await Hash({
      key: this.password,
      SALT_ROUNDS: process.env.SALT_ROUNDS,
    });
  }

  if ((this.isNew || this.isModified("phone")) && this.phone) {
  this.phone = await Encrypt({
    key: this.phone,
    SECRET_KEY: process.env.SECRET_KEY,
  });
}

  next();
});

// Middleware for updateOne
userSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    update.password = await Hash({
      key: update.password,
      SALT_ROUNDS: process.env.SALT_ROUNDS,
    });
  }

if (update?.phone) {
  update.phone = await Encrypt({
    key: update.phone,
    SECRET_KEY: process.env.SECRET_KEY,
  });
}


  next();
});
userSchema.post(['find', 'findOne', "findById"], async function (docs) {
  // Check if docs is an array (for find) or a single document (for findOne)
  if (Array.isArray(docs)) {
    for (const doc of docs) {
      if (doc?.phone) {
        doc.phone = await Decrypt({
          key: doc.phone,
          SECRET_KEY: process.env.SECRET_KEY,
        });
      }
    }
  } else if (docs?.phone) {
    docs.phone = await Decrypt({
      key: docs.phone,
      SECRET_KEY: process.env.SECRET_KEY,
    });
  }
});

export const UserModel = mongoose.model.User || mongoose.model("User", userSchema);
export const connectionUser = new Map();
