const { db, auth: firebaseAuth } = require('../config/firebaseAdmin');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // 1. Create user in Firebase Auth
        const userRecord = await firebaseAuth.createUser({
            email,
            password,
            displayName: username,
        });

        // 2. Store extra data in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            username,
            email,
            points: 1000,
            createdAt: new Date(),
        });

        res.json({
            msg: 'User created successfully',
            user: { id: userRecord.uid, username, email }
        });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(400).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    // Note: With Firebase, login usually happens on the frontend.
    // The frontend sends the IdToken to the backend in the Authorization header.
    // This route can be used to sync/fetch user data from Firestore after frontend login.
    const { email } = req.body;
    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (userSnapshot.empty) return res.status(400).json({ msg: 'User not found' });

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        res.json({
            user: { id: userDoc.id, username: userData.username, email: userData.email }
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server Error');
    }
};
