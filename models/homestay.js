const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homestaySchema = new Schema({
    homeCode: {
        type: String,
        required: true
    },
    homeName: {
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
        type: String,
        required:true
    },
    updateBy: {
        type: String,
        required:true
    }
});

module.exports = mongoose.model("homestay", homestaySchema);