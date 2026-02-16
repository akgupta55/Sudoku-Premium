const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUserProfile, deductPoints } = require('../controllers/userController');

// GET /api/user/profile - Get current user profile (includes points)
router.get('/profile', auth, getUserProfile);

// POST /api/user/deduct-points - Deduct points from user wallet
router.post('/deduct-points', auth, deductPoints);

module.exports = router;
