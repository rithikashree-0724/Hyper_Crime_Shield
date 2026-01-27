const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// Get Heatmap Data (lat/lng of crimes)
router.get('/heatmap', auth, async (req, res) => {
    // In a real app, we would have lat/lng in the Report model.
    // For now, we'll mock it or aggregate based on categories if location data existed.
    try {
        const reports = await Report.find().select('category status createdAt');
        // Mocking geo data for demo since we don't have it in schema
        const heatmapData = reports.map(r => ({
            id: r._id,
            lat: 28.6139 + (Math.random() - 0.5) * 0.1, // Random around New Delhi
            lng: 77.2090 + (Math.random() - 0.5) * 0.1,
            intensity: r.status === 'closed' ? 0.5 : 1
        }));
        res.json(heatmapData);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Investigator Performance Stats (Admin Only)
router.get('/performance', auth, auth.authorize('admin'), async (req, res) => {
    try {
        const stats = await Report.aggregate([
            { $match: { assignedTo: { $exists: true } } },
            {
                $group: {
                    _id: "$assignedTo",
                    totalAssigned: { $sum: 1 },
                    resolved: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } }
                }
            },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'investigator' } },
            { $unwind: "$investigator" },
            {
                $project: {
                    name: "$investigator.name",
                    totalAssigned: 1,
                    resolved: 1,
                    rate: { $multiply: [{ $divide: ["$resolved", "$totalAssigned"] }, 100] }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Export Reports as CSV
router.get('/export/csv', auth, auth.authorize('admin'), async (req, res) => {
    try {
        const reports = await Report.find().populate('reporter', 'name email').populate('assignedTo', 'name');

        let csv = 'Report ID,Title,Category,Status,Reporter,Assigned To,Date\n';
        reports.forEach(r => {
            const reporterName = r.isAnonymous ? 'Anonymous' : (r.reporter?.name || 'N/A');
            const assignedName = r.assignedTo?.name || 'Unassigned';
            csv += `${r.complaintId},"${r.title}",${r.category},${r.status},${reporterName},${assignedName},${r.createdAt.toISOString()}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('crime_reports.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
