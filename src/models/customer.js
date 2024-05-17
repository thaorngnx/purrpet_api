import mongoose from 'mongoose';
import { ROLE } from '../utils/constants';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const customerSchema = new Schema(
  {
    purrPetCode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: Object,
    },
    role: {
      type: String,
      default: ROLE.CUSTOMER,
    },
    coin: {
      type: Number,
      default: 0,
    },
    point: {
      type: Number,
      default: 0,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
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

export default mongoose.model('customer', customerSchema);
