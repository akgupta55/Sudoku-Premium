const { getSudoku } = require('sudoku-gen');
const Score = require('../models/Score');
const User = require('../models/User');

exports.generatePuzzle = (req, res) => {
    const { difficulty } = req.params; // easy, medium, hard
    try {
        const sudoku = getSudoku(difficulty || 'easy');
        res.json(sudoku);
    } catch (err) {
        res.status(500).json({ msg: 'Error generating puzzle' });
    }
};

exports.saveScore = async (req, res) => {
    const { difficulty, timeTaken } = req.body;
    try {
        const newScore = new Score({
            userId: req.user.id,
            difficulty,
            timeTaken,
        });
        await newScore.save();
        res.json(newScore);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const scores = await Score.find()
            .populate('userId', 'username')
            .sort({ timeTaken: 1 })
            .limit(10);
        res.json(scores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
