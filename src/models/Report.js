import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  title: { type: String, required: true },
  dateRange: { type: String, default: '' },
  summary: { type: String, default: '' },
  metrics: {
    spend: Number,
    revenue: Number,
    roas: Number,
    orders: Number,
  },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
