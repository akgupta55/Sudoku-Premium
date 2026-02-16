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

// --- 1. HEALTH CHECK & PORT BINDING (First Priority) ---
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- SUDOKU PREMIUM STARTUP ---`);
    console.log(`🚀 Listening on 0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);

    // Connect to DB after server is successfully listening
    if (process.env.MONGODB_URI) {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('✅ MongoDB Connected'))
            .catch((err) => console.error('❌ DB Error:', err));
    } else {
        console.warn('⚠️ MONGODB_URI not found.');
    }
});

// --- 2. MIDDLEWARE & SECURITY ---
// Security Middleware (Relaxed CSP for production static serving)
app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json());

// --- 3. ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

// --- 4. STATIC FILES (Production) ---
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../frontend/dist');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.error('❌ Static dist folder not found at:', distPath);
    }
} else {
    app.get('/', (req, res) => {
        res.send('Sudoku Hackathon API is running...');
    });
}
