import mongoose from "mongoose";
import { isEmail } from "validator";
import { STATUS_BOOKING } from "../common/constants";

const Schema = mongoose.Schema;

export const bookingSpaSchema = new Schema({
    bookingSpaCode: {
        type: String,
        required: true
    },
    serviceSpas: {
        type: Array,
        required:true
    },
    bookingSpaPrice: {
        type: Number,
        required:true
    },
    email:{
        type: String,
        required:true,
        validator: [isEmail, 'invalid email']
    },
    buyerPhone: {
        type: Number,
        length: 10,
        required: true
    },
    buyerName: {
        type: String,
        required:true,
        trim: true
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

export default mongoose.model("bookingSpa", bookingSpaSchema);