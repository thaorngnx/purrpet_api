import mongoose from 'mongoose';
import {
  STATUS_CATEGORY,
  CATEGORY_TYPE,
  STATUS_COIN,
} from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const coinSchema = new Schema(
  {
    customerCode: {
      type: String,
      required: true,
    },
    coin: {
      type: Number,
      required: true,
    },
    orderCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: [STATUS_COIN.PLUS, STATUS_COIN.MINUS],
        message: '{VALUE} is not supported',
      },
      default: STATUS_COIN.PLUS,
    },
  },
  { timestamps: true },
);

export default mongoose.model('coin', coinSchema);
