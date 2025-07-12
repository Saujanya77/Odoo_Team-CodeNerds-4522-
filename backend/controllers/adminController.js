// const User = require('../models/User');
// const Swap = require('../models/Swap');

// // List all users
// exports.listUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-passwordHash');
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Ban (or unban) a user
// exports.banUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });
//     user.banned = !user.banned;
//     await user.save();
//     res.json({ msg: user.banned ? 'User banned' : 'User unbanned' });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // List all swaps
// exports.listSwaps = async (req, res) => {
//   try {
//     const swaps = await Swap.find()
//       .populate('fromUser', 'name email')
//       .populate('toUser', 'name email')
//       .sort({ createdAt: -1 });
//     res.json(swaps);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // List all feedback logs
// exports.listFeedback = async (req, res) => {
//   try {
//     const users = await User.find({}, 'name feedback');
//     // Feedback is already an array field on each user
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };