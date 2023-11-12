import mongoose from 'mongoose';

mongoose.set('runValidators', true);

const Schema = mongoose.Schema;

export const customerSchema = new Schema({
    purrPetCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: false,
        unique: true
    },
    address: {
        type: String,
        required: false,
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
{ timestamps: true });

export default mongoose.model('customer', customerSchema);