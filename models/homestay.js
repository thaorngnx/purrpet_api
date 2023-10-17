import mongoose from "mongoose";
import { COLLECTION } from "../common/constants.js";
const Schema = mongoose.Schema;

export const homestaySchema = new Schema({
    homeCode: {
        type: String,
        required: true
    },
    homeName: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION.CATEGORY,
        index: false,
    },
    images: {
        type: Array,
        required:true
    },
    status: {
        type: String,
        required:true
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