import mongoose from 'mongoose';
import {
  PAYMENT_METHOD,
  STATUS_ORDER,
  STATUS_PAYMENT,
} from '../utils/constants';

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
    payMethod: {
      type: String,
      enum: {
        values: [PAYMENT_METHOD.COD, PAYMENT_METHOD.VNPAY],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: [STATUS_PAYMENT.WAITING_FOR_PAY, STATUS_PAYMENT.PAID],
        message: '{VALUE} is not supported',
      },
      default: STATUS_PAYMENT.WAITING_FOR_PAY,
    },
    pointUsed: {
      type: Number,
      default: 0,
    },
    totalPayment: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          STATUS_ORDER.NEW,
          STATUS_ORDER.PREPARE,
          STATUS_ORDER.DELIVERING,
          STATUS_ORDER.CANCEL,
          STATUS_ORDER.DONE,
        ],
        message: '{VALUE} is not supported',
      },
      default: STATUS_ORDER.NEW,
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
