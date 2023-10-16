import mongoose from "mongoose";
import { STATUS_ACCOUNT, ROLE } from "../global/constants";
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
        enum: [ROLE.ADMIN, ROLE.STAFF],
        default: ROLE.STAFF,
    },
    status: {
        type: String,
        enum: [STATUS_ACCOUNT.ENABLED, STATUS_ACCOUNT.DISABLED],
        default: STATUS_ACCOUNT.ENABLED,   
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


