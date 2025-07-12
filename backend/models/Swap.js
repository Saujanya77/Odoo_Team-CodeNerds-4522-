import mongoose from 'mongoose';

const SwapSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: String, required: true },
  wantedSkill: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Swap', SwapSchema);