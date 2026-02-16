const { getSudoku } = require('sudoku-gen');
const { db, admin } = require('../config/firebaseAdmin');

exports.generatePuzzle = (req, res) => {
    const { difficulty } = req.params; // easy, medium, hard
    const { level } = req.query; // numeric level (1, 2, 3...)

    try {
        const sudoku = getSudoku(difficulty || 'easy');

        // If level is provided, we manually "create" the puzzle by taking 
        // the solution and clearing exactly X number of spots.
        if (level && !isNaN(parseInt(level))) {
            const levelNum = Math.min(Math.max(parseInt(level), 1), 80); // Cap at 80 empty spots
            const solutionArr = sudoku.solution.split('');
            const puzzleArr = [...solutionArr];

            // Randomly pick indices to clear
            const indices = Array.from({ length: 81 }, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }

            const toClear = indices.slice(0, levelNum);
            toClear.forEach(idx => {
                puzzleArr[idx] = '-';
            });

            sudoku.puzzle = puzzleArr.join('');
        }

        res.json(sudoku);
    } catch (err) {
        console.error('Puzzle Generation Error:', err);
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
