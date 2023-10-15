const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
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
        required:true
    },
    updateAt: {
        type: Number,
        required:true
    },
    createBy: {
        type: Number,
        required:true
    },
    updateBy: {
        type: Number,
        required:true
    }
});

module.exports = mongoose.model("product", productSchema);

