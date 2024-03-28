import mongoose from 'mongoose';
import { STATUS_CATEGORY, CATEGORY_TYPE } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const categorySchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    categoryType: {
      type: String,
      enum: {
        values: [
          CATEGORY_TYPE.PRODUCT,
          CATEGORY_TYPE.SPA,
          CATEGORY_TYPE.HOMESTAY,
        ],
        message: '{VALUE} is not supported',
      },
      default: CATEGORY_TYPE.PRODUCT,
    },
    status: {
      type: String,
      enum: {
        values: [STATUS_CATEGORY.ACTIVE, STATUS_CATEGORY.INACTIVE],
        message: '{VALUE} is not supported',
      },
      default: STATUS_CATEGORY.ACTIVE,
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

export default mongoose.model('category', categorySchema);
