const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    fileSize: { type: Number },
    hash: { type: String, required: true }, // SHA-256 hash for integrity
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Citizen or Investigator
    chainOfCustody: [{
        action: String, // 'uploaded', 'viewed', 'downloaded'
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evidence', evidenceSchema);
