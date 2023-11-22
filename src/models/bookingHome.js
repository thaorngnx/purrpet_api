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
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    homeCode: {
      type: String,
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
    customerNote: {
      type: String,
      trim: true,
    },
    dateCheckIn: {
      type: Date,
      required: true,
    },
    dateCheckOut: {
      type: Date,
      required: true,
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
      default: Object[STATUS_BOOKING.NEW],
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
