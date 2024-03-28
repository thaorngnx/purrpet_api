import mongoose from 'mongoose';
import { STATUS_ORDER } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const orderSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    orderItems: {
      type: Array,
      JSON: true,
      required: true,
    },
    orderPrice: {
      type: Number,
      required: true,
    },
    customerCode: {
      type: String,
      required: true,
      trim: true,
    },
    customerAddress: {
      type: Object,
      required: true,
    },
    customerNote: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          STATUS_ORDER.WAITING_FOR_PAY,
          STATUS_ORDER.PAID,
          STATUS_ORDER.DELIVERING,
          STATUS_ORDER.CANCEL,
          STATUS_ORDER.DONE,
        ],
        message: '{VALUE} is not supported',
      },
      default: STATUS_ORDER.WAITING_FOR_PAY,
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
export default mongoose.model('order', orderSchema);
