const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const Investigation = require('../models/Investigation');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // File upload middleware (Multer)

// Get All Reports (For Dashboard)
router.get('/', auth, async (req, res) => {
    try {
        let options = {
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                { model: Investigation, as: 'investigation' }
            ],
            order: [['createdAt', 'DESC']]
        };

        if (req.user.role === 'citizen') {
            options.where = { userId: req.user.id };
        } else if (req.user.role === 'investigator') {
            // Investigators see all reports or assigned ones? 
            // For now, let's say they see all non-anonymous or all in general.
            // Or maybe filtered by status.
        }

        const reports = await Report.findAll(options);
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create Report
router.post('/', auth, upload.array('evidence'), async (req, res) => {
    try {
        const { title, description, category, severity, location, isAnonymous, suspects, incidentDate } = req.body;

        let evidencePaths = [];
        if (req.files) {
            evidencePaths = req.files.map(file => file.path);
        }

        // Generate Custom ID
        const date = new Date();
        const year = date.getFullYear();
        const count = await Report.count();
        const complaintId = `CRIME-${year}-${(count + 1).toString().padStart(4, '0')}`;

        const report = await Report.create({
            userId: req.user.id,
            complaintId,
            title,
            description,
            category,
            severity,
            location,
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            suspects,
            incidentDate,
            evidence: evidencePaths // Sequelize handles JSON stringify if dialect supports JSON, else might need manual stringify? MySQL 5.7+ supports JSON.
        });

        // Return full report with user
        // const fullReport = await Report.findByPk(report.id, { include: 'user' });

        res.status(201).json(report);

        // Real-time notification for investigators/admin
        if (req.io) {
            req.io.emit('new_report', report);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Single Report by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
                { model: Investigation, as: 'investigation' },
                {
                    model: Message,
                    as: 'messages',
                    include: [{ model: User, as: 'sender', attributes: ['name', 'role'] }]
                }
            ]
        });

        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Access Control
        if (req.user.role === 'citizen' && report.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Report Status (Investigator/Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role === 'citizen') {
            return res.status(403).json({ message: 'Not authorized to update status' });
        }

        const { status } = req.body;
        const report = await Report.findByPk(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        report.status = status;
        await report.save();

        res.json(report);

        // Real-time update
        if (req.io) {
            req.io.emit('report_updated', report);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add Message to Report
router.post('/:id/message', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const report = await Report.findByPk(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Create Message
        const message = await Message.create({
            reportId: report.id,
            senderId: req.user.id,
            content
        });

        // Fetch sender for response and emission
        const fullMessage = await Message.findByPk(message.id, {
            include: [{ model: User, as: 'sender', attributes: ['name', 'role'] }]
        });

        // Emit Socket Event
        if (req.io) {
            req.io.to(report.id.toString()).emit('receive_message', fullMessage);
        }

        res.status(201).json(fullMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Messages for a Report
router.get('/:id/messages', auth, async (req, res) => {
    try {
        const Message = require('../models/Message');
        const messages = await Message.findAll({
            where: { reportId: req.params.id },
            include: [{ model: User, as: 'sender', attributes: ['name', 'role'] }],
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Escalate Case
router.put('/:id/escalate', auth, async (req, res) => {
    try {
        // Only Investigators/Admin can escalate? Or maybe citizens too if ignored?
        // Let's assume Investigator initiates escalation.
        if (req.user.role === 'citizen') return res.status(403).json({ message: 'Not authorized' });

        const report = await Report.findByPk(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        report.status = 'escalated';
        await report.save();

        // Emit update
        const io = req.app.get('io');
        if (io) io.to(report.id).emit('status_update', { status: 'escalated' });

        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
