const express = require('express');
const router = express.Router();
const { generatePuzzle, saveScore, getLeaderboard } = require('../controllers/gameController');
const auth = require('../middleware/authMiddleware');

router.get('/puzzle/:difficulty', generatePuzzle);
router.post('/score', auth, saveScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
