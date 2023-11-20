import mongoose from "mongoose";
import { STATUS_BOOKING } from "../utils/constants";

mongoose.set("runValidators", true);

const Schema = mongoose.Schema;

export const bookingHomeSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    homeCode:{
      type: String,
      required: true,
    },
    masterDataCode:{
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    bookingHomePrice: {
      type: Number,
      required: true,
    },
    customerCode: {
      type: String,
      required: true,
      trim: true,
    },
    date:{
      type: Array,
      Date: true,
      required: true,
    },
    customerNote: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          STATUS_BOOKING.NEW,
          STATUS_BOOKING.WAITING_FOR_PAY,
          STATUS_BOOKING.PAID,
          STATUS_BOOKING.CHECKIN,
          STATUS_BOOKING.CHECKOUT,
          STATUS_BOOKING.CANCEL,
        ],
        message: "{VALUE} is not supported",
      },
      default: STATUS_BOOKING.NEW,
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

export default mongoose.model("bookingHome", bookingHomeSchema);
