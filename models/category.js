import mongoose from "mongoose";
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
        required:true
    },
    statusName: {
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

export default mongoose.model("category", categorySchema);