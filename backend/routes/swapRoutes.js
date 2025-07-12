// const express = require('express');
// const { createSwap, listSwaps, updateSwapStatus } = require('../controllers/swapController');
// const auth = require('../middleware/auth');
// const router = express.Router();

// router.post('/', auth, createSwap);
// router.get('/', auth, listSwaps);
// router.patch('/:id', auth, updateSwapStatus);

// module.exports = router;
import express from 'express';
import {
  createSwapRequest,
  getAllSwapRequests,
  updateSwapStatus
} from "../controllers/swapController.js";
import { userAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/swaps',userAuth, createSwapRequest);
router.get('/swaps/:userId', getAllSwapRequests);
router.put('/swaps/status/:swapId', updateSwapStatus);

export default router;
