import mongoose from 'mongoose';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const notificationSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'Please fill your userId'],
    },
    title: {
      type: String,
      required: [true, 'Please fill title'],
    },
    message: {
      type: String,
      required: [true, 'Please fill message'],
    },
    image: {
      type: Array,
      required: false,
    },
    type: {
      type: String,
      default: '',
    },
    orderCode: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model('notification', notificationSchema);
