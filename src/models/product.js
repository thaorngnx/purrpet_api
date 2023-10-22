import mongoose from 'mongoose';
import { STATUS_PRODUCT, TYPE_PRODUCT } from '../common/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const productSchema = new Schema({
    purrPetCode: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryCode: {
        type: String,
        required: true
    },
    typeProduct: {
        type: String,
        enum: {
            values: [TYPE_PRODUCT.DOG, TYPE_PRODUCT.CAT],
            message: "{VALUE} is not supported",
        },
        default: TYPE_PRODUCT.DOG   
    },
    images: {
        type: Array
    },
    invetory: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: [STATUS_PRODUCT.ACTIVE, STATUS_PRODUCT.INACTIVE],
            message: "{VALUE} is not supported",
        },
        default: STATUS_PRODUCT.ACTIVE
    },
    createBy: {
        type: String
    },
    updateBy: {
        type: String 
    }
}, { timestamps: true });

export default mongoose.model("product", productSchema);

