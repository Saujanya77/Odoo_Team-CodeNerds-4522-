import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  rating: Number
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  location: String,
  profilePhotoUrl: String,
  skillsOffered: [String],
  skillsWanted: [String],
  availability: [String],
  isPublic: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  feedback: [FeedbackSchema],
  banned: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  otp: {
    code: String,
    expiresAt: Date,
    sentTo: [String] // Track where OTP was sent ('sms', 'email')
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);


export default User;