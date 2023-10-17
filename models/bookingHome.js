import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const bookingHomeSchema = new Schema({
    bookingHomeCode: {
        type: String,
        required: true
    },
    serviceHomes: {
        type: Array,
        required:true
    },
    bookingHomePrice: {
        type: Number,
        required:true
    },
    buyerPhone: {
        type: Number,
        length: 10,
        required:true
    },
    buyerName: {
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

export default mongoose.model("bookingHome", bookingHomeSchema);