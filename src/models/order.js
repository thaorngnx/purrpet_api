import mongoose from "mongoose";
import { isEmail } from "validator";
import { STATUS_ORDER } from "../common/constants";

const Schema = mongoose.Schema;

export const orderSchema = new Schema({
    orderCode: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    orderPrice: {
        type: Number,
        required: true
    },
    buyerPhone: {
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        validator: [isEmail, 'invalid email']
    },
    buyerName: {
        type: String,
        required: true,
        trim: true
    },
    buyerLocation: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: [Object[STATUS_ORDER.NEW], Object[STATUS_ORDER.WAITING_FOR_PAY], 
                Object[STATUS_ORDER.PAID], Object[STATUS_ORDER.DELIVERING], 
                Object[STATUS_ORDER.CANCEL], Object[STATUS_ORDER.DONE]],
            message: "{VALUE} is not supported",
        },
        default: Object[STATUS_ORDER.NEW]
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

export default mongoose.model("order", orderSchema);



