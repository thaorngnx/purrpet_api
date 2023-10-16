import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const productSchema = new Schema({
    productCode: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required:true
    },
    category: {
        type: String,
        required:true
    },
    categoryName: {
        type: String,
        required:true
    },
    images: {
        type: Array,
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
        type: Number
    },
    updateBy: {
        type: Number 
    }
});

export default mongoose.model("product", productSchema);

