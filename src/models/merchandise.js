import mongoose from 'mongoose';
import { STATUS_PRODUCT } from '../utils/constants';
import { boolean } from 'joi';

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
  priceDiscount: {
    type: Number,
  },
  status: {
    type: String,
    enum: {
      values: [STATUS_PRODUCT.ACTIVE, STATUS_PRODUCT.INACTIVE],
      message: '{VALUE} is not supported',
    },
    default: STATUS_PRODUCT.ACTIVE,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  promotion: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('merchandise', merchandiseSchema);
