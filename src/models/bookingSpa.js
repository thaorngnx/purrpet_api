import mongoose from 'mongoose';
import { STATUS_BOOKING } from '../common/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const bookingSpaSchema = new Schema({
    purrPetCode: {
        type: String,
        required: true
    },
    bookingSpaItems: {
        type: Array,
        required:true
    },
    bookingSpaPrice: {
        type: Number,
        required:true
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
        required:true,
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
        default: STATUS_BOOKING.NEW
    },
    createBy: {
        type: String
    },
    updateBy: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("bookingSpa", bookingSpaSchema);