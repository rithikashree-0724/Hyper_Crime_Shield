const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    status: { type: String, enum: ['reported', 'investigating', 'resolved', 'dismissed'], default: 'reported' },
    evidence: [{ type: String }], // URLs to evidence files/logs
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
