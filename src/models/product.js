import mongoose from 'mongoose';
import { STATUS_PRODUCT } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const productSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryCode: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    inventory: {
      type: Number,
      required: true,
    },
    star: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: {
        values: [STATUS_PRODUCT.ACTIVE, STATUS_PRODUCT.INACTIVE],
        message: '{VALUE} is not supported',
      },
      default: STATUS_PRODUCT.ACTIVE,
    },
    createBy: {
      type: String,
    },
    updateBy: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('product', productSchema);
