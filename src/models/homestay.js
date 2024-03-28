import mongoose from 'mongoose';
import { STATUS_HOME, HOME_TYPE } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const homestaySchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    homeType: {
      type: String,
      enum: {
        values: [HOME_TYPE.DOG, HOME_TYPE.CAT],
        message: '{VALUE} is not supported',
      },
      default: HOME_TYPE.DOG,
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
    masterDataCode: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: [STATUS_HOME.ACTIVE, STATUS_HOME.INACTIVE],
        message: '{VALUE} is not supported',
      },
      default: STATUS_HOME.ACTIVE,
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

export default mongoose.model('homestay', homestaySchema);
