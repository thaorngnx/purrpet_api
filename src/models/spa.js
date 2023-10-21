import mongoose from 'mongoose';
import { STATUS_SPA } from '../common/constants';
const Schema = mongoose.Schema;

export const spaSchema = new Schema({
    spaCode: {
        type: String,
        required: true
    },
    spaName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryCode: {
        type: Array,
        required: true
    },
    categoryName: {
        type: Array,
        required: true
    },
    images: {
        type: Array
    },
    inventory: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_SPA.ACTIVE, STATUS_SPA.INACTIVE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_SPA.ACTIVE
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

export default mongoose.model("spa", spaSchema);

