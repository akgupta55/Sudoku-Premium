const logger = require('./utils/logger');
logger.info('--- 🚀 SUDOKU PREMIUM STARTUP SEQUENCE 🚀 ---');

const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Critical Error Handlers
process.on('uncaughtException', (err) => {
    logger.error('🔥 FATAL: Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('🔥 FATAL: Unhandled Rejection:', reason);
});

// 2. Health Check & Core Middleware
app.get('/health', (req, res) => res.status(200).send('OK'));
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// 3. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { msg: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// 4. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

// 5. Static Assets (Production Only)
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
        logger.info('✅ Production assets mounted');
    } else {
        logger.error('❌ Static assets missing at:', distPath);
    }
} else {
    app.get('/', (req, res) => res.send('Sudoku API in Development Mode'));
}

// 6. DB Connection and Server Start
const startServer = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            logger.info('✅ MongoDB Connected');
        } else {
            logger.warn('⚠️ MONGODB_URI missing');
        }

        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`🚀 Server listening on 0.0.0.0:${PORT}`);
            logger.info('--- 🏁 SETUP SEQUENCE COMPLETE 🏁 ---');
        });
    } catch (err) {
        logger.error('🔥 Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();

module.exports = app; // For testing
