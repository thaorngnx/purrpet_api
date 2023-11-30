import mongoose from "mongoose";

mongoose.set("runValidators", true);

const Schema = mongoose.Schema;

export const customerSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: Object,
    },
    refreshToken: {
      type: String,
    },
    createBy: {
      type: String,
    },
    updateBy: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("customer", customerSchema);
