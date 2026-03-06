const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const Investigation = require('../models/Investigation');
const Message = require('../models/Message');
const CaseHistory = require('../models/CaseHistory');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // File upload middleware (Multer)
const paginate = require('../middleware/paginate');
const { trackStatusChange } = require('../utils/activityHelper');
const { reportValidationRules, validate } = require('../middleware/validator');
// const { generateReportsPDF, generateReportsExcel } = require('../utils/exportHelper');
const { sendEmail, templates } = require('../utils/emailService');

// Get All Reports (For Dashboard)
router.get('/', auth, paginate, async (req, res, next) => {
    try {
        const { limit, offset, page } = req.pagination;
        let options = {
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                {
                    model: Investigation,
                    as: 'investigation',
                    include: [
                        { model: User, as: 'primaryInvestigator', attributes: ['name', 'email', 'department'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        };

        if (req.user.role === 'citizen') {
            options.where = { userId: req.user.id };
        } else if (req.user.role === 'investigator') {
            // Investigators see all reports or assigned ones? 
            // For now, let's say they see all non-anonymous or all in general.
            // Or maybe filtered by status.
        }

        const { count, rows: reports } = await Report.findAndCountAll(options);
        res.json({
            success: true,
            data: reports,
            pagination: {
                total: count,
                page,
                limit,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        next(err);
    }
});

const reportController = require('../controllers/reportController');

// Create Report
router.post('/', auth, upload.array('evidence'), reportValidationRules(), validate, reportController.createReport);


// Get Single Report by ID
router.get('/:id', auth, async (req, res, next) => {
    try {
        const report = await Report.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
                { model: Investigation, as: 'investigation' },
                { model: CaseHistory, as: 'history' },
                {
                    model: Message,
                    as: 'messages',
                    include: [{ model: User, as: 'sender', attributes: ['name', 'role', 'department'] }]
                }
            ],
            order: [[{ model: Message, as: 'messages' }, 'createdAt', 'ASC']]
        });

        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Access Control
        if (req.user.role === 'citizen' && report.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Map history to timeline for frontend
        const reportData = report.toJSON();
        reportData.timeline = reportData.history || [];
        delete reportData.history;

        res.json({ success: true, data: reportData });
    } catch (err) {
        next(err);
    }
});

// Update Report Status (Investigator/Admin)
router.put('/:id', auth, async (req, res, next) => {
    try {
        if (req.user.role === 'citizen') {
            return res.status(403).json({ message: 'Not authorized to update status' });
        }

        const { status } = req.body;
        const report = await Report.findByPk(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        const oldStatus = report.status;
        report.status = status;
        await report.save();

        // Track History & Notify
        await trackStatusChange({
            reportId: report.id,
            userId: report.userId,
            changedBy: req.user.id,
            oldStatus,
            newStatus: status,
            message: `Your report status has been updated to ${status}.`
        });

        // Send Email Notification
        const user = await User.findByPk(report.userId);
        if (user && user.email) {
            const emailData = templates.statusUpdate(report);
            await sendEmail(user.email, emailData.subject, emailData.text, emailData.html);
        }

        res.json({ success: true, data: report });

        // Real-time update
        if (req.io) {
            req.io.emit('report_updated', report);
        }
    } catch (err) {
        next(err);
    }
});

// Add Message to Report
router.post('/:id/message', auth, async (req, res, next) => {
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
            include: [{ model: User, as: 'sender', attributes: ['name', 'role', 'department'] }]
        });

        // Emit Socket Event
        if (req.io) {
            req.io.to(report.id.toString()).emit('receive_message', fullMessage);
        }

        res.status(201).json({ success: true, data: fullMessage });
    } catch (err) {
        next(err);
    }
});

// Get Messages for a Report
router.get('/:id/messages', auth, async (req, res, next) => {
    try {
        const messages = await Message.findAll({
            where: { reportId: req.params.id },
            include: [{ model: User, as: 'sender', attributes: ['name', 'role', 'department'] }],
            order: [['createdAt', 'ASC']]
        });
        res.json({ success: true, data: messages });
    } catch (err) {
        next(err);
    }
});

// Escalate Case
router.put('/:id/escalate', auth, async (req, res, next) => {
    try {
        if (req.user.role === 'citizen') return res.status(403).json({ message: 'Not authorized' });

        const report = await Report.findByPk(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        const oldStatus = report.status;
        report.status = 'escalated';
        await report.save();

        // Track History & Notify
        await trackStatusChange({
            reportId: report.id,
            userId: report.userId,
            changedBy: req.user.id,
            oldStatus,
            newStatus: 'escalated',
            message: `Your report has been escalated for further review.`
        });

        // Emit update
        const io = req.app.get('io');
        if (io) io.to(report.id.toString()).emit('status_update', { status: 'escalated' });

        res.json({ success: true, data: report });
    } catch (err) {
        next(err);
    }
});

const { generateReportsPDF, generateReportsExcel } = require('../utils/exportHelper');

// Export Reports (Admin/Investigator)
router.get('/export/pdf', auth, auth.authorize('admin', 'investigator'), async (req, res, next) => {
    try {
        const reports = await Report.findAll({
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
        });
        const pdfBuffer = await generateReportsPDF(reports);
        res.header('Content-Type', 'application/pdf');
        res.attachment('crime_reports.pdf');
        res.send(pdfBuffer);
    } catch (err) {
        next(err);
    }
});

router.get('/export/excel', auth, auth.authorize('admin', 'investigator'), async (req, res, next) => {
    try {
        const reports = await Report.findAll({
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
        });
        const excelBuffer = generateReportsExcel(reports);
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('crime_reports.xlsx');
        res.send(excelBuffer);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
