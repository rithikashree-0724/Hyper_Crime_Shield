const { Report, User, Investigation, AuditLog } = require('../models');
const { trackStatusChange } = require('../utils/activityHelper');

/**
 * @desc Create new crime report with auto-assignment
 */
exports.createReport = async (req, res, next) => {
    try {
        const { title, description, category, severity, location, isAnonymous, suspects, incidentDate } = req.body;
        const evidence = req.files ? req.files.map(file => file.path) : [];

        // Generate Custom Complaint ID
        const date = new Date();
        const year = date.getFullYear();
        const count = await Report.count();
        const complaintId = `CRIME-${year}-${(count + 1).toString().padStart(4, '0')}`;

        // 1. Create the Report
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
            evidence
        });

        // 2. Auto-Assignment Logic (Department-Based)
        const categoryMap = {
            'Financial Fraud': 'financial@hypershield.net',
            'Online Fraud': 'financial@hypershield.net',
            'Identity Theft': 'identity@hypershield.net',
            'Cyber Bullying': 'bullying@hypershield.net',
            'Phishing Attack': 'phishing@hypershield.net',
            'Malware & Virus': 'malware@hypershield.net',
            'Data Breach': 'databreach@hypershield.net'
        };

        const targetEmail = categoryMap[category] || 'financial@hypershield.net'; // Default to financial if no match
        const investigator = await User.findOne({ where: { email: targetEmail, role: 'investigator' } });

        let targetInvestigatorId = investigator ? investigator.id : null;

        if (!targetInvestigatorId) {
            // Fallback: Find any active investigator if department match fails
            const backupInv = await User.findOne({ where: { role: 'investigator', isVerified: true } });
            targetInvestigatorId = backupInv ? backupInv.id : null;
        }

        // 3. Create Investigation Record
        await Investigation.create({
            reportId: report.id,
            status: 'active',
            investigatorIds: targetInvestigatorId ? [targetInvestigatorId] : [],
        });

        // 4. Audit Log
        await AuditLog.create({
            userId: req.user.id,
            action: 'REPORT_CREATED',
            resource: 'Report',
            resourceId: report.id,
            details: { complaintId: report.complaintId }
        });

        res.status(201).json({ success: true, data: report });

        if (req.io) {
            req.io.emit('new_report', report);
        }
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Get reports for current user or all for admin/investigator
 */
exports.getReports = async (req, res, next) => {
    try {
        let options = {
            include: [{ model: User, as: 'user', attributes: ['name', 'role'] }],
            order: [['createdAt', 'DESC']]
        };

        if (req.user.role === 'citizen') {
            options.where = { userId: req.user.id };
        }

        const reports = await Report.findAll(options);
        res.json({ success: true, data: reports });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Update report status and track history
 */
exports.updateReportStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const report = await Report.findByPk(id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (req.user.role === 'citizen' && report.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const oldStatus = report.status;
        report.status = status;
        await report.save();

        await trackStatusChange({
            reportId: report.id,
            userId: report.userId,
            changedBy: req.user.id,
            oldStatus,
            newStatus: status
        });

        if (req.io) {
            req.io.emit('report_updated', report);
        }

        res.json({ success: true, data: report });
    } catch (err) {
        next(err);
    }
};
