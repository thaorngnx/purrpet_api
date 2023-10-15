const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    userCode: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    role: {
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

module.exports = mongoose.model("account", accountSchema);


