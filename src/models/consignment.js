import mongoose from 'mongoose';
import { STATUS_PRODUCT } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const consignmentSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    productList: {
      type: Array,
      JSON: true,
      required: true,
    },
    supplierCode: {
      type: String,
      required: true,
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

export default mongoose.model('consignment', consignmentSchema);
