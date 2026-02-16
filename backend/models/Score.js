const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'expert'], required: true },
    timeTaken: { type: Number, required: true }, // in seconds
    completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', scoreSchema);
