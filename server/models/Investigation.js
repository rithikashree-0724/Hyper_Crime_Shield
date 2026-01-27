const mongoose = require('mongoose');

const investigationSchema = new mongoose.Schema({
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true, unique: true },
    investigators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notes: [{
        content: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now }
    }],
    tasks: [{
        title: String,
        isCompleted: { type: Boolean, default: false },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    outcome: { type: String }, // Final verdict
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investigation', investigationSchema);
