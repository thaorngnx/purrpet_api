import mongoose from "mongoose";
import "../common/constants.js";
import { ROLE, STATUS_ACCOUNT } from "../common/constants.js";
const Schema = mongoose.Schema;

export const accountSchema = new Schema({
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
        default: ROLE.STAFF
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

export default mongoose.model("account", accountSchema);


