const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Report, AuditLog, Investigation } = require('../models');

const { generateUserPDF, generateUserExcel } = require('../utils/privacyExportHelper');

/**
 * @swagger
 * /api/privacy/export:
 *   get:
 *     summary: Export all user data (GDPR Right to Portability)
 *     tags: [Privacy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, pdf, excel]
 *         description: Export format
 *     responses:
 *       200:
 *         description: User data exported successfully
 */
router.get('/export', auth, async (req, res, next) => {
    try {
        const format = req.query.format || 'json';
        const isAdmin = req.user.role === 'admin';

        let data;
        const { generateUserPDF, generateUserExcel, generateGlobalPDF, generateGlobalExcel } = require('../utils/privacyExportHelper');

        if (isAdmin) {
            // Fetch ALL reports for Admin
            data = await Report.findAll({
                include: [
                    { model: User, as: 'user', attributes: ['name', 'email'] },
                    {
                        model: Investigation,
                        as: 'investigation'
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            // Since Investigation.investigatorIds is a JSON array of IDs, 
            // the helper will need to handle names or we fetch all investigators here.
            // For now, let's just fetch all investigators to map IDs to names in the helper.
            const investigators = await User.findAll({
                where: { role: 'investigator' },
                attributes: ['id', 'name', 'department']
            });
            const invMap = investigators.reduce((acc, inv) => ({ ...acc, [inv.id]: `${inv.name} (${inv.department})` }), {});

            if (format === 'pdf') {
                const pdfBuffer = await generateGlobalPDF(data, invMap);
                res.header('Content-Type', 'application/pdf');
                res.attachment(`HyperShield_Global_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                return res.send(pdfBuffer);
            } else if (format === 'excel') {
                const excelBuffer = generateGlobalExcel(data, invMap);
                res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.attachment(`HyperShield_Global_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
                return res.send(excelBuffer);
            }
        } else {
            // Existing User Personal Data Export
            data = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password', 'refreshToken', 'loginOtp', 'loginOtpExpires'] },
                include: [
                    { model: Report, as: 'reports' },
                    { model: AuditLog, as: 'auditLogs' }
                ]
            });

            if (!data) return res.status(404).json({ message: 'User not found' });

            if (format === 'pdf') {
                const pdfBuffer = await generateUserPDF(data);
                res.header('Content-Type', 'application/pdf');
                res.attachment(`${data.name}_data.pdf`);
                return res.send(pdfBuffer);
            } else if (format === 'excel') {
                const excelBuffer = generateUserExcel(data);
                res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.attachment(`${data.name}_data.xlsx`);
                return res.send(excelBuffer);
            }
        }

        res.json({
            success: true,
            message: isAdmin ? 'Global report exported' : 'User data exported',
            data: data
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/privacy/account:
 *   delete:
 *     summary: Delete user account (GDPR Right to Erasure)
 *     tags: [Privacy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account scheduled for deletion
 */
router.delete('/account', auth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Soft delete the user (paranoid: true is enabled in model)
        await user.destroy();

        res.json({
            success: true,
            message: 'Account scheduled for deletion. You will be logged out.'
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
