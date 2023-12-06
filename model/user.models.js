import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Contact: {
    type: Number,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    default: 1,
  },
  avatar: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("User", UserSchema);
