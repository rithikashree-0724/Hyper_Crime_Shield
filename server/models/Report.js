const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for anonymous
    isAnonymous: { type: Boolean, default: false },
    complaintId: { type: String, unique: true }, // Auto-generated human readable ID
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    status: { type: String, enum: ['reported', 'investigating', 'resolved', 'dismissed'], default: 'reported' },
    evidence: [{ type: String }], // URLs to evidence files/logs
    location: { type: String },
    incidentDate: { type: Date },
    suspects: [{ type: String }],
    timeline: [{
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now }
    }],
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Auto-generate Complaint ID
reportSchema.pre('save', function (next) {
    if (!this.complaintId) {
        this.complaintId = 'CR-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Report', reportSchema);
