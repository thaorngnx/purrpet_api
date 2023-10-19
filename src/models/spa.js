import mongoose from "mongoose";
import { STATUS_SPA, COLLECTION } from "../common/constants";
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
            values: [Object[STATUS_SPA.ACTIVE], Object[STATUS_SPA.INACTIVE]],
            message: "{VALUE} is not supported",
        },
        default: Object[STATUS_SPA.ACTIVE]
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

