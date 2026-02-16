const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Early logs for Cloud Run debugging
console.log('--- SUDOKU BACKEND INITIALIZING ---');
process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 UNHANDLED REJECTION:', reason);
});

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
    console.log(`Checking static files at: ${distPath}`);
    if (fs.existsSync(distPath)) {
        console.log('✅ Static dist folder found.');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.error('❌ Static dist folder NOT FOUND in current production environment!');
    }
} else {
    app.get('/', (req, res) => {
        res.send('Sudoku Hackathon API is running...');
    });
}

const PORT = process.env.PORT || 8080;

// Start server first to satisfy Cloud Run health check
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);

    // Connect to DB after server is up
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is missing!');
    } else {
        mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => console.log('✅ MongoDB Connected'))
            .catch((err) => console.error('❌ MongoDB Connection Error:', err));
    }
});
