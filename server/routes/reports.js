const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth); // All report routes require authentication

router.post('/', upload.array('evidence', 5), createReport);
router.get('/', getReports);
router.get('/', getReports);
router.patch('/:id/status', updateReportStatus);
router.post('/:id/message', async (req, res) => {
    try {
        const report = await require('../models/Report').findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Basic ACL: Only Reporter, Admin, or Assigned Investigator can msg
        // For simplicity allow all auth users for now or check if req.user.id == report.reporter

        report.messages.push({
            sender: req.user.id,
            message: req.body.message
        });
        await report.save();
        res.json(report.messages);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
