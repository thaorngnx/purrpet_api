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
        enum: {
           values: [ROLE.ADMIN, ROLE.STAFF],
        message: "{VALUE} is not supported",
        },
        default: ROLE.STAFF
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_ACCOUNT.ACTIVE, STATUS_ACCOUNT.INACTIVE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_ACCOUNT.ACTIVE
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

