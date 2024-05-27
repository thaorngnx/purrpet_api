import mongoose from 'mongoose';
import {
  PAYMENT_METHOD,
  STATUS_ORDER,
  STATUS_PAYMENT,
  STATUS_REFUND,
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
        values: [PAYMENT_METHOD.COD, PAYMENT_METHOD.VNPAY, PAYMENT_METHOD.COIN],
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
    useCoin: {
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
          STATUS_ORDER.RETURN,
        ],
        message: '{VALUE} is not supported',
      },
      default: STATUS_ORDER.NEW,
    },
    statusRefund: {
      type: String,
      enum: {
        values: [
          STATUS_REFUND.WAITING,
          STATUS_REFUND.ACCEPT,
          STATUS_REFUND.CANCEL,
          STATUS_REFUND.REFUND,
        ],
        message: '{VALUE} is not supported',
      },
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
