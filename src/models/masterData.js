import mongoose from "mongoose";

mongoose.set("runValidators", true);

const Schema = mongoose.Schema;

export const masterDataSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    groupCode: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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

export default mongoose.model("masterData", masterDataSchema);
