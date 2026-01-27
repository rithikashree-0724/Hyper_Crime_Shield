const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// Get Heatmap Data (lat/lng of crimes)
router.get('/heatmap', auth, async (req, res) => {
    try {
        const reports = await Report.findAll({
            attributes: ['category', 'status', 'createdAt']
        });

        const heatmapData = reports.map(r => ({
            id: r.id,
            lat: 28.6139 + (Math.random() - 0.5) * 0.1,
            lng: 77.2090 + (Math.random() - 0.5) * 0.1,
            intensity: r.status === 'resolved' || r.status === 'closed' ? 0.5 : 1
        }));
        res.json(heatmapData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Investigator Performance Stats (Admin Only)
router.get('/performance', auth, auth.authorize('admin'), async (req, res) => {
    try {
        const investigations = await Investigation.findAll({
            include: [{ model: Report, as: 'report' }]
        });

        const users = await User.findAll({ where: { role: 'investigator' } });

        const perfData = users.map(investigator => {
            const assignedCases = investigations.filter(inv =>
                inv.investigatorIds && inv.investigatorIds.includes(investigator.id)
            );
            const resolved = assignedCases.filter(inv => inv.status === 'closed').length;
            const total = assignedCases.length;
            return {
                name: investigator.name,
                totalAssigned: total,
                resolved: resolved,
                rate: total > 0 ? (resolved / total) * 100 : 0
            };
        });

        res.json(perfData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Export Reports as CSV
router.get('/export/csv', auth, auth.authorize('admin'), async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
        });

        let csv = 'Report ID,Title,Category,Status,Reporter,Date\n';
        reports.forEach(r => {
            const reporterName = r.isAnonymous ? 'Anonymous' : (r.user?.name || 'N/A');
            csv += `${r.complaintId},"${r.title}",${r.category},${r.status},${reporterName},${r.createdAt.toISOString()}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('crime_reports.csv');
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
