import mongoose from "mongoose";
import { COLLECTION, STATUS_HOME } from "../common/constants.js";

const Schema = mongoose.Schema;

export const homestaySchema = new Schema({
    homeCode: {
        type: String,
        required: true
    },
    homeName: {
        type: String,
        required: true,
        trim: true
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
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_HOME.ACTIVE, STATUS_HOME.INACTIVE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_HOME.ACTIVE
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

export default mongoose.model("homestay", homestaySchema);