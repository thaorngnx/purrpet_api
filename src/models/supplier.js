import mongoose from 'mongoose';
import { STATUS_PRODUCT } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const supplierSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
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

export default mongoose.model('supplier', supplierSchema);
