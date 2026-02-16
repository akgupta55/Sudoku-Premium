const { getSudoku } = require('sudoku-gen');
const { db, admin } = require('../config/firebaseAdmin');

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
        const scoreData = {
            userId: req.user.id,
            email: req.user.email,
            difficulty,
            timeTaken,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection('scores').add(scoreData);
        res.json({ id: docRef.id, ...scoreData });
    } catch (err) {
        console.error('Save Score Error:', err.message);
        res.status(500).send('Server Error');
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const scoresSnapshot = await db.collection('scores')
            .orderBy('timeTaken', 'asc')
            .limit(10)
            .get();

        const scores = scoresSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(scores);
    } catch (err) {
        console.error('Leaderboard Error:', err.message);
        res.status(500).send('Server Error');
    }
};
