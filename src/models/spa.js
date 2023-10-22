import mongoose from 'mongoose';
import { STATUS_SPA } from '../common/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const spaSchema = new Schema({
    purrPetCode: {
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
        type: String,
        required: true
    },
    images: {
        type: Array
    },
    invetory: {
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
    createBy: {
        type: String
    },
    updateBy: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("spa", spaSchema);

