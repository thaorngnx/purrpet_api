import mongoose from "mongoose";
import { STATUS_CATEGORY } from "../common/constants.js";
const Schema = mongoose.Schema;

export const categorySchema = new Schema({
    categoryCode: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required:true
    },
    categoryType: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_CATEGORY.ACTIVE, STATUS_CATEGORY.INACTIVE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_CATEGORY.ACTIVE
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

export default mongoose.model("category", categorySchema);