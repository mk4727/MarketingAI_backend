import mongoose from 'mongoose';

const connectedAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['google-ads', 'meta-ads', 'shopify', 'ga4', 'merchant', 'gtm'], required: true },
  accountName: { type: String, default: '' },
  status: { type: String, enum: ['connected', 'disconnected', 'error'], default: 'disconnected' },
  connectedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('ConnectedAccount', connectedAccountSchema);
