const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderCode: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required:true
    },
    orderPrice: {
        type: Number,
        required:true
    },
    buyerPhone: {
        type: Number,
        required:true
    },
    buyerName: {
        type: String,
        required:true
    },
    buyerLocation: {
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

module.exports = mongoose.model("order", orderSchema);



