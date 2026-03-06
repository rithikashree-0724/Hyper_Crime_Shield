const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const Evidence = require('../models/Evidence');
const Report = require('../models/Report');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/evidence';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper: Calculate File Hash
const calculateHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
};

// Upload Evidence
router.post('/:reportId', auth, upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const fileHash = await calculateHash(req.file.path);

        const evidence = await Evidence.create({
            reportId: req.params.reportId,
            fileName: req.file.originalname,
            fileUrl: req.file.path.replace(/\\/g, '/'),
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            hash: fileHash,
            uploadedById: req.user.id,
            chainOfCustody: [{ action: 'uploaded', actorId: req.user.id, timestamp: new Date() }]
        });

        // Link to Report (Update the evidence JSON array)
        const report = await Report.findByPk(req.params.reportId);
        if (report) {
            let existingEvidence = report.evidence || [];
            existingEvidence.push(evidence.fileUrl);
            report.evidence = existingEvidence;
            report.changed('evidence', true);
            await report.save();
        }

        res.status(201).json({ success: true, data: evidence });
    } catch (err) {
        next(err);
    }
});

// Get Evidence for a Report
router.get('/:reportId', auth, async (req, res, next) => {
    try {
        const evidence = await Evidence.findAll({
            where: { reportId: req.params.reportId },
            include: [{ model: User, as: 'uploader', attributes: ['name'] }]
        });
        res.json({ success: true, data: evidence });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
