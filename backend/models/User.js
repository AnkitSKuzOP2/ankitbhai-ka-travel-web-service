import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },
    firstName: { type: String },
    lastName: { type: String },
    dob: { type: Date },
    gender: { type: String },
    mobile: {
      type: String,
    },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    zipCode: { type: String },
    bio: { type: String, maxLength: 500 },
    
    isVerified: {
      type: Boolean,
      default: false
    },
    
    verificationCode: {
      type: String
    },

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
