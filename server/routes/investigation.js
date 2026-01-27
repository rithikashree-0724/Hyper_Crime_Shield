const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const Investigation = require('../models/Investigation');

// Get assigned investigations (Investigator) or all (Admin)
router.get('/', auth, async (req, res) => {
    try {
        if (process.env.USE_MOCK_DATA === 'true') {
            return res.json([
                { _id: 'inv1', report: { title: 'Mock Phishing Case', complaintId: 'CR-123456' }, status: 'investigating' }
            ]);
        }

        let filter = {};
        if (req.user.role === 'investigator') {
            filter.investigators = req.user.id;
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const investigations = await Investigation.find(filter).populate('report');
        res.json(investigations);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Assign Investigator (Admin or self-claim)
router.post('/:reportId/assign', auth, async (req, res) => {
    try {
        const { investigatorId } = req.body; // If empty, assign self
        const targetId = investigatorId || req.user.id;

        // Find or create investigation
        let investigation = await Investigation.findOne({ report: req.params.reportId });
        if (!investigation) {
            investigation = new Investigation({ report: req.params.reportId, investigators: [] });
        }

        if (!investigation.investigators.includes(targetId)) {
            investigation.investigators.push(targetId);
            await investigation.save();
        }

        // Update Report status
        await Report.findByIdAndUpdate(req.params.reportId, {
            status: 'investigating',
            $push: { timeline: { status: 'investigating', note: 'Investigator assigned', updatedBy: req.user.id } }
        });

        res.json(investigation);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Note
router.post('/:id/note', auth, async (req, res) => {
    try {
        const investigation = await Investigation.findById(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        investigation.notes.push({
            content: req.body.content,
            author: req.user.id
        });
        await investigation.save();
        res.json(investigation);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
