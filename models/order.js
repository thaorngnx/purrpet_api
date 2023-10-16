import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const orderSchema = new Schema({
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

export default mongoose.model("order", orderSchema);



