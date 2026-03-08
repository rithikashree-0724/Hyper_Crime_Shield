const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { trackStatusChange } = require('../utils/activityHelper');
const Report = require('../models/Report');
const Investigation = require('../models/Investigation');

// Get assigned investigations (Investigator) or all (Admin)
router.get('/', auth, async (req, res, next) => {
    try {
        let options = {
            include: [{ model: Report, as: 'report' }]
        };

        if (req.user.role === 'investigator') {
            const allInvestigations = await Investigation.findAll(options);
            const filtered = allInvestigations.filter(inv =>
                inv.investigatorIds && inv.investigatorIds.includes(req.user.id)
            );
            return res.json(filtered);
        } else if (req.user.role === 'admin') {
            const investigations = await Investigation.findAll(options);
            return res.json({ success: true, data: investigations });
        } else {
            // Citizens: return investigations for their own reports only
            const userReports = await Report.findAll({ where: { userId: req.user.id }, attributes: ['id'] });
            const reportIds = userReports.map(r => r.id);
            const investigations = await Investigation.findAll({
                where: { reportId: reportIds },
                include: [{ model: Report, as: 'report' }]
            });
            return res.json({ success: true, data: investigations });
        }
    } catch (err) {
        next(err);
    }
});

// Get investigation progress by report ID (accessible by case owner, investigator, admin)
router.get('/by-report/:reportId', auth, async (req, res, next) => {
    try {
        const investigation = await Investigation.findOne({
            where: { reportId: req.params.reportId },
            include: [{ model: Report, as: 'report' }]
        });

        // If no investigation exists yet, citizens can still see the base timeline
        if (!investigation) {
            // But verify the report belongs to the citizen
            if (req.user.role === 'citizen') {
                const report = await Report.findOne({ where: { id: req.params.reportId, userId: req.user.id } });
                if (!report) return res.status(403).json({ message: 'Access denied' });
            }
            return res.status(404).json({ message: 'No investigation started yet' });
        }

        // Citizens can only see their own report's investigation (parseInt fixes int vs string mismatch)
        if (req.user.role === 'citizen' && parseInt(investigation.report?.userId) !== parseInt(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});


// Assign Investigator (Admin or self-claim)
router.post('/:reportId/assign', auth, async (req, res, next) => {
    try {
        const { investigatorId } = req.body;
        const targetId = investigatorId || req.user.id;

        let investigation = await Investigation.findOne({ where: { reportId: req.params.reportId } });

        if (!investigation) {
            investigation = await Investigation.create({
                reportId: req.params.reportId,
                investigatorIds: [targetId],
                primaryInvestigatorId: targetId
            });
        } else {
            let ids = investigation.investigatorIds || [];
            if (!ids.includes(targetId)) {
                ids.push(targetId);
                investigation.investigatorIds = ids;

                // If no primary is set, set this one
                if (!investigation.primaryInvestigatorId) {
                    investigation.primaryInvestigatorId = targetId;
                }

                investigation.changed('investigatorIds', true);
                await investigation.save();
            }
        }

        // Update Report status
        await Report.update(
            { status: 'investigating' },
            { where: { id: req.params.reportId } }
        );

        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});

// Add Note
router.post('/:id/note', auth, async (req, res, next) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        let notes = investigation.notes || [];
        notes.push({
            content: req.body.content,
            authorId: req.user.id,
            date: new Date()
        });

        investigation.notes = notes;
        investigation.changed('notes', true);
        await investigation.save();

        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});

// Add Task
router.post('/:id/task', auth, async (req, res, next) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        let tasks = investigation.tasks || [];
        tasks.push({
            title: req.body.title,
            isCompleted: false,
            assignedTo: req.body.assignedTo || req.user.id
        });

        investigation.tasks = tasks;
        investigation.changed('tasks', true);
        await investigation.save();

        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});

// Toggle Task Completion
router.patch('/:id/task/:index', auth, async (req, res, next) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        let tasks = investigation.tasks || [];
        const index = parseInt(req.params.index);

        if (tasks[index]) {
            tasks[index].isCompleted = !tasks[index].isCompleted;
            investigation.tasks = tasks;
            investigation.changed('tasks', true);
            await investigation.save();
        }

        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});

// Update Investigation Step
router.patch('/:id/step', auth, async (req, res, next) => {
    try {
        const { step, status, reportData } = req.body;
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        // Update status and report data based on step
        switch (step) {
            case 'complaint_review':
                investigation.complaintReviewStatus = status;
                break;
            case 'forensic':
                investigation.forensicStatus = status;
                if (reportData) investigation.forensicReport = reportData;
                break;
            case 'transaction':
                investigation.transactionStatus = status;
                if (reportData) investigation.transactionReport = reportData;
                break;
            case 'call_analysis':
                investigation.callAnalysisStatus = status;
                if (reportData) investigation.callAnalysisReport = reportData;
                break;
            case 'physical_verification':
                investigation.physicalVerificationStatus = status;
                if (reportData) investigation.physicalVerificationReport = reportData;
                break;
            case 'evidence_summary':
                investigation.evidenceSummary = reportData;
                break;
            default:
                return res.status(400).json({ message: 'Invalid investigation step' });
        }

        await investigation.save();
        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});

// Resolve Case (Final)
router.post('/:id/resolve', auth, async (req, res, next) => {
    try {
        const { finalReport, outcome } = req.body;
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        // Check if all steps are completed
        const steps = [
            investigation.complaintReviewStatus,
            investigation.forensicStatus,
            investigation.transactionStatus,
            investigation.callAnalysisStatus,
            investigation.physicalVerificationStatus
        ];

        // Some cases might not require all steps, but for this implementation, 
        // we'll check if any are explicitly "completed" or "verified"
        // In a real app, logic would be more flexible per case type.

        investigation.finalReport = finalReport;
        investigation.outcome = outcome;
        investigation.status = 'closed';
        investigation.resolvedDate = new Date();
        await investigation.save();

        // Update Report status
        await Report.update(
            { status: 'resolved' },
            { where: { id: investigation.reportId } }
        );

        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});

// Set Final Outcome (Existing route, kept for compatibility but resolve is preferred)
router.post('/:id/outcome', auth, async (req, res, next) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        investigation.outcome = req.body.outcome;
        investigation.status = 'closed';
        investigation.resolvedDate = new Date();
        await investigation.save();

        // Update Report status as well
        await Report.update(
            { status: 'resolved' },
            { where: { id: investigation.reportId } }
        );

        res.json({ success: true, data: investigation });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
