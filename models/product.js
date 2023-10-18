import mongoose from "mongoose";
import { STATUS_PRODUCT } from "../common/constants.js";

const Schema = mongoose.Schema;

export const productSchema = new Schema({
    productCode: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
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
        type: Array
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_PRODUCT.ACTIVE, STATUS_PRODUCT.INACTIVE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_PRODUCT.ACTIVE
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

export default mongoose.model("product", productSchema);

