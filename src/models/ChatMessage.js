import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  followUps: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('ChatMessage', chatMessageSchema);
