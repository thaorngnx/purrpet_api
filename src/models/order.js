import mongoose from 'mongoose';
import { STATUS_ORDER } from '../common/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const orderSchema = new Schema({
    purrPetCode: {
        type: String,
        required: true
    },
    orderItems: {
        type: Array,
        required: true
    },
    orderPrice: {
        type: Number,
        required: true
    },
    customerPhone: {
        type: Number,
        required: true
    },
    customerEmail:{
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerAddress: {
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
            values: [STATUS_ORDER.NEW, STATUS_ORDER.WAITING_FOR_PAY, 
                STATUS_ORDER.PAID, STATUS_ORDER.DELIVERING, 
                STATUS_ORDER.CANCEL, STATUS_ORDER.DONE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_ORDER.NEW
    },
    createBy: {
        type: String
    },
    updateBy: {
        type: String
    }
}, { timestamps: true });
export default mongoose.model("order", orderSchema);



