import mongoose from 'mongoose';

const keywordSchema = new mongoose.Schema({
  keyword: String,
  matchType: { type: String, enum: ['Broad', 'Phrase', 'Exact'] },
  clicks: Number,
  impressions: Number,
  ctr: Number,
  cpc: Number,
  cost: Number,
  conversions: Number,
  cpa: Number,
  status: { type: String, enum: ['active', 'paused'], default: 'active' },
});

const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  platform: { type: String, enum: ['google-ads', 'meta-ads', 'shopify', 'ga4', 'merchant', 'gtm'], required: true },
  status: { type: String, enum: ['active', 'paused', 'ended'], default: 'active' },
  spend: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  roas: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  cpc: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  cpa: { type: Number, default: 0 },
  frequency: { type: Number, default: 0 },
  keywords: { type: [keywordSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
