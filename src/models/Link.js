import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true, index: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Link', linkSchema);