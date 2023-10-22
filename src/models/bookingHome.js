import mongoose from 'mongoose';
import { STATUS_BOOKING } from '../common/constants';

const Schema = mongoose.Schema;

export const bookingHomeSchema = new Schema({
    purrPetCode: {
        type: String,
        required: true
    },
    bookingHomeItems: {
        type: Array,
        required: true
    },
    bookingHomePrice: {
        type: Number,
        required: true
    },
    customerEmail:{
        type: String,
        required: true
    },
    customerPhone: {
        type: Number,
        length: 10,
        required: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerNote: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_BOOKING.NEW, STATUS_BOOKING.WAITING_FOR_PAY, 
                STATUS_BOOKING.PAID, STATUS_BOOKING.CHECKIN, 
                STATUS_BOOKING.CHECKOUT, STATUS_BOOKING.CANCEL],
            message: "{VALUE} is not supported",
        },
        default: Object[STATUS_BOOKING.NEW]
    },
    createBy: {
        type: String
    },
    updateBy: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("bookingHome", bookingHomeSchema);