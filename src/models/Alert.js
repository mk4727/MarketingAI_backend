import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  severity: { type: String, enum: ['critical', 'warning', 'info'], required: true },
  platform: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  metric: { type: String, default: '' },
  changePct: { type: Number, default: 0 },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
