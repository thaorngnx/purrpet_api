import mongoose from "mongoose";
import {COLLECTION } from "../common/constants.js";
const Schema = mongoose.Schema;

export const spaSchema = new Schema({
    spaCode: {
        type: String,
        required: true
    },
    spaName: {
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
        required:true
    },
    updateAt: {
        type: Number,
        required:true
    },
    createBy: {
        type: String,
        required:true
    },
    updateBy: {
        type: String,
        required:true
    }
});

export default mongoose.model("spa", spaSchema);

