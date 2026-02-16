const { db, admin } = require('../config/firebaseAdmin');

exports.getUserProfile = async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.id).get();
        if (!userDoc.exists) return res.status(404).json({ msg: 'User not found' });

        res.json(userDoc.data());
    } catch (err) {
        console.error('Get Profile Error:', err.message);
        res.status(500).send('Server Error');
    }
};

exports.deductPoints = async (req, res) => {
    const { amount } = req.body;
    try {
        const userRef = db.collection('users').doc(req.user.id);

        await db.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            if (!doc.exists) throw new Error('User not found');

            const currentPoints = doc.data().points || 0;
            const deduction = amount || 5;

            if (currentPoints < deduction) {
                throw new Error('Insufficient points');
            }

            t.update(userRef, { points: currentPoints - deduction });
        });

        const updatedDoc = await userRef.get();
        res.json({ points: updatedDoc.data().points });
    } catch (err) {
        console.error('Deduct Points Error:', err.message);
        res.status(400).json({ msg: err.message });
    }
};
