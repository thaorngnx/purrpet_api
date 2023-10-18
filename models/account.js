import mongoose from "mongoose";
import { ROLE, STATUS_ACCOUNT } from "../common/constants.js";

const Schema = mongoose.Schema;

export const accountSchema = new Schema({
    userCode: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 20
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