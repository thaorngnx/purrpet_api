import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userCode: {
    type: String,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
});

export default mongoose.model('favorite', favoriteSchema);
