const { auth: firebaseAuth } = require('../config/firebaseAdmin');

const auth = async (req, res, next) => {
    // Look for Bearer token in Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.header('x-auth-token');

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decodedToken = await firebaseAuth.verifyIdToken(token);
        req.user = { id: decodedToken.uid, email: decodedToken.email };
        next();
    } catch (err) {
        console.error('Firebase Auth Error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
