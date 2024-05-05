import mongoose from 'mongoose';
import { STATUS_PRODUCT } from '../utils/constants';

const merchandiseSchema = new mongoose.Schema({
  purrPetCode: {
    type: String,
    required: true,
  },
  inventory: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: [STATUS_PRODUCT.ACTIVE, STATUS_PRODUCT.INACTIVE],
      message: '{VALUE} is not supported',
    },
    default: STATUS_PRODUCT.ACTIVE,
  },
});

export default mongoose.model('merchandise', merchandiseSchema);
