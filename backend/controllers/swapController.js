// const Swap = require('../models/Swap');
// const User = require('../models/User');

import Swap from "../models/Swap.js";

// // Create a swap request
// exports.createSwap = async (req, res) => {
//   try {
//     const { toUser, offeredSkill, wantedSkill, message } = req.body;

//     // Prevent requesting yourself
//     if (toUser === req.user._id.toString()) {
//       return res.status(400).json({ msg: "Can't request swap with yourself" });
//     }

//     const swap = new Swap({
//       fromUser: req.user._id,
//       toUser,
//       offeredSkill,
//       wantedSkill,
//       message
//     });
//     await swap.save();
//     res.status(201).json(swap);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // List all swaps related to logged-in user (either as sender or receiver)
// exports.listSwaps = async (req, res) => {
//   try {
//     const swaps = await Swap.find({
//       $or: [
//         { fromUser: req.user._id },
//         { toUser: req.user._id }
//       ]
//     })
//       .populate('fromUser', 'name email')
//       .populate('toUser', 'name email')
//       .sort({ createdAt: -1 });
//     res.json(swaps);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Update swap status (accept/reject/cancel)
// exports.updateSwapStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body; // 'accepted', 'rejected', 'cancelled'
//     const swap = await Swap.findById(id);

//     if (!swap) return res.status(404).json({ msg: 'Swap not found' });

//     // Only receiver can accept/reject, sender can cancel
//     if (
//       (status === 'accepted' || status === 'rejected') &&
//       swap.toUser.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ msg: 'Only the target user can accept/reject.' });
//     }
//     if (
//       status === 'cancelled' &&
//       swap.fromUser.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ msg: 'Only the requester can cancel.' });
//     }

//     swap.status = status;
//     await swap.save();
//     res.json(swap);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
// import Swap from '../models/Swap.js';
// import User from '../models/User.js'; // optional if you want to validate user existence

export const createSwapRequest = async (req, res) => {
  try {
    const { fromUser=req.userId, toUser, offeredSkill, wantedSkill, message } = req.body;

    // Optional: validate if users exist
    // const from = await User.findById(fromUser);
    // const to = await User.findById(toUser);
    // if (!from || !to) return res.status(404).json({ msg: 'User not found' });

    const newSwap = new Swap({
      fromUser,
      toUser,
      offeredSkill,
      wantedSkill,
      message
    });

    await newSwap.save();

    res.status(201).json({
      success: true,
      message: "Swap request sent successfully!",
      swap: newSwap
    });
  } catch (error) {
    console.error("Error creating swap request:", error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

export const getAllSwapRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const swaps = await Swap.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, swaps });
  } catch (error) {
    console.error("Error getting swaps:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSwapStatus = async (req, res) => {
  try {
    const { swapId } = req.params;
    const { status } = req.body;

    // Only allow specific statuses
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updatedSwap = await Swap.findByIdAndUpdate(
      swapId,
      { status },
      { new: true }
    );

    if (!updatedSwap) {
      return res.status(404).json({ success: false, message: 'Swap not found' });
    }

    res.status(200).json({
      success: true,
      message: `Swap ${status} successfully`,
      swap: updatedSwap
    });
  } catch (error) {
    console.error("Error updating swap status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
