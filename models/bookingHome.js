import mongoose from "mongoose";
import isEmail from "validator/lib/isemail";
import { STATUS_BOOKING } from "../common/constants";
import e from "cors";
const Schema = mongoose.Schema;

export const bookingHomeSchema = new Schema({
    bookingHomeCode: {
        type: String,
        required: true
    },
    serviceHomes: {
        type: Array,
        required:true
    },
    bookingHomePrice: {
        type: Number,
        required:true
    },
    email:{
        type: String,
        required:true,
    },
    buyerPhone: {
        type: Number,
        length: 10,
        required:true
    },
    buyerName: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_BOOKING.NEW, STATUS_BOOKING.WAITING_FOR_PAY, STATUS_BOOKING.PAID, STATUS_BOOKING.CHECKIN, STATUS_BOOKING.CHECKOUT, STATUS_BOOKING.CANCEL],
            message: "{VALUE} is not supported",
        },
        default: STATUS_BOOKING.NEW
    },
    createAt: {
        type: Number,
        default: Date.now()
    },
    updateAt: {
        type: Number,
        default: Date.now()
    },
    createBy: {
        type: String
    },
    updateBy: {
        type: String
    }
});

export default mongoose.model("bookingHome", bookingHomeSchema);