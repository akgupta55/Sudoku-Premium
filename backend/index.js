console.log('--- 🚀 SUDOKU PREMIUM STARTUP SEQUENCE 🚀 ---');
console.log('Current Directory:', process.cwd());
console.log('Dirname:', __dirname);

const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 1. Critical Error Handlers
process.on('uncaughtException', (err) => {
    console.error('🔥 FATAL: Uncaught Exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('🔥 FATAL: Unhandled Rejection:', reason);
});

dotenv.config();
console.log('✅ Environment Variables Loaded');

const app = express();
const PORT = process.env.PORT || 8080;

// 2. Immediate Port Binding for Cloud Run
console.log(`📡 Attempting to bind to port ${PORT}...`);
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is officially LISTENING on 0.0.0.0:${PORT}`);

    // Connect to DB as background task
    if (process.env.MONGODB_URI) {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('✅ MongoDB Connection Successful'))
            .catch((err) => console.error('❌ MongoDB Connection Failed:', err.message));
    } else {
        console.warn('⚠️  Warning: MONGODB_URI is not set!');
    }
});

server.on('error', (err) => {
    console.error('🔥 Server Error during listen:', err);
    process.exit(1);
});

// 3. Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));
console.log('✅ Health Check Endpoint Registered');

// 4. Middleware
app.set('trust proxy', 1); // Essential for Cloud Run
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
console.log('✅ Middleware Configured');

// 5. Routes
try {
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/game', require('./routes/gameRoutes'));
    console.log('✅ Routes Loaded');
} catch (err) {
    console.error('❌ Failed to load routes:', err.message);
}

// 6. Static Files (Production)
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../frontend/dist');
    console.log(`📂 Checking Production Assets at: ${distPath}`);
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
        console.log('✅ Production Assets Found and Mounted');
    } else {
        console.error('❌ ERROR: Static/Front-end assets MISSING at:', distPath);
        // List parent directory to help debug
        try {
            const parentDir = path.join(__dirname, '..');
            console.log(`Parent Directory (${parentDir}) contents: ${fs.readdirSync(parentDir)}`);
        } catch (e) { }
    }
} else {
    app.get('/', (req, res) => res.send('Sudoku API Dev Mode'));
}

console.log('--- 🏁 SETUP SEQUENCE COMPLETE 🏁 ---');
