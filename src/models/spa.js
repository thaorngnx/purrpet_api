import mongoose from 'mongoose';
import { STATUS_SPA, SPA_TYPE } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const spaSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    spaName: {
      type: String,
      required: true,
      trim: true,
    },
    spaType: {
      type: String,
      enum: {
        values: [SPA_TYPE.DOG, SPA_TYPE.CAT],
        message: '{VALUE} is not supported',
      },
      default: SPA_TYPE.DOG,
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
    status: {
      type: String,
      enum: {
        values: [STATUS_SPA.ACTIVE, STATUS_SPA.INACTIVE],
        message: '{VALUE} is not supported',
      },
      default: STATUS_SPA.ACTIVE,
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

export default mongoose.model('spa', spaSchema);
