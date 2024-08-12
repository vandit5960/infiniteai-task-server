import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  dob: { type: Date },
  mobileNumber: { type: String },
  state: { type: String },
  country: { type: String },
  city: { type: String },
  role: { type: String },
  status: { type: Boolean, default: true },
  permissions: {
    type: Object,
    default: {
      update: true,
      insert: true,
      select: true,
      delete: true,
    },
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
