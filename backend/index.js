const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security Middleware (Relaxed CSP for production static serving)
app.use(helmet({
    contentSecurityPolicy: false,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Sudoku Hackathon API is running...');
    });
}

// Database Connection (Async, don't block server start)
if (!process.env.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined.');
} else {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.error('Database Connection Error:', err));
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ready and listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
