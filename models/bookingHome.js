const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingHomeSchema = new Schema({
    bookingHomeCode: {
        type: String,
        required: true
    },
    services: {
        type: Array,
        required:true
    },
    bookingHomePrice: {
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

const BookingHome = mongoose.model("BookingHome", bookingHomeSchema);