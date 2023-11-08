import mongoose from "mongoose";
import { STATUS_HOME } from "../utils/constants";

mongoose.set("runValidators", true);

const Schema = mongoose.Schema;

export const homestaySchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    homeName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryCode: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    inventory: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: [STATUS_HOME.ACTIVE, STATUS_HOME.INACTIVE],
        message: "{VALUE} is not supported",
      },
      default: STATUS_HOME.ACTIVE,
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

export default mongoose.model("homestay", homestaySchema);
