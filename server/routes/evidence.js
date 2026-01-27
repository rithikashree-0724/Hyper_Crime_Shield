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
router.post('/:reportId', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const fileHash = await calculateHash(req.file.path);

        const evidence = new Evidence({
            report: req.params.reportId,
            fileName: req.file.originalname,
            fileUrl: req.file.path.replace(/\\/g, '/'),
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            hash: fileHash,
            uploadedBy: req.user.id,
            chainOfCustody: [{ action: 'uploaded', actor: req.user.id }]
        });

        await evidence.save();

        // Link to Report
        await Report.findByIdAndUpdate(req.params.reportId, {
            $push: { evidence: evidence.fileUrl }
        });

        res.status(201).json(evidence);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Evidence for a Report
router.get('/:reportId', auth, async (req, res) => {
    try {
        const evidence = await Evidence.find({ report: req.params.reportId });
        res.json(evidence);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
