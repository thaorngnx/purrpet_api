import mongoose from 'mongoose';
import { STATUS_HOME } from '../common/constants';

const Schema = mongoose.Schema;

export const homestaySchema = new Schema({
    homeCode: {
        type: String,
        required: true
    },
    homeName: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryCode: {
        type: Array,
        required: true
    },
    categoryName: {
        type: Array,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    inventory: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_HOME.ACTIVE, STATUS_HOME.INACTIVE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_HOME.ACTIVE
    },
    createBy: {
        type: String
    },
    updateBy: {
        type: String
    }
}, {
    timestamps: {
        currentTime: () => new Date().getTime(),
    },
} );

export default mongoose.model("homestay", homestaySchema);