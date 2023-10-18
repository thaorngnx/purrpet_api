import mongoose from "mongoose";
import { STATUS_SPA } from "../common/constants.js";
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION.CATEGORY,
        index: false
    },
    images: {
        type: Array
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_SPA, STATUS_SPA.INACTIVE],
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

