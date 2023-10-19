import mongoose from "mongoose";
import { isEmail } from "validator";
import { STATUS_BOOKING } from "../common/constants";

const Schema = mongoose.Schema;

export const bookingHomeSchema = new Schema({
    bookingHomeCode: {
        type: String,
        required: true
    },
    serviceHomes: {
        type: Array,
        required: true
    },
    bookingHomePrice: {
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        validator: [isEmail, 'invalid email']
    },
    buyerPhone: {
        type: Number,
        length: 10,
        required: true
    },
    buyerName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: [Object[STATUS_BOOKING.NEW], Object[STATUS_BOOKING.WAITING_FOR_PAY], 
                Object[STATUS_BOOKING.PAID], Object[STATUS_BOOKING.CHECKIN], 
                Object[STATUS_BOOKING.CHECKOUT], Object[STATUS_BOOKING.CANCEL]],
            message: "{VALUE} is not supported",
        },
        default: Object[STATUS_BOOKING.NEW]
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