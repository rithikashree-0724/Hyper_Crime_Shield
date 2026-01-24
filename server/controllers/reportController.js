const Report = require('../models/Report');

// Enhanced Mock Data Store (Process Persistence)
let MOCK_REPORTS = [
    {
        _id: 'RPT-2026-001',
        title: 'Unauthorized Database Exfiltration Attempt',
        description: 'Detected suspicious outbound traffic on port 1433 originating from node 04. Data packets matched the profile of client credit meta-data. Source IP: 192.168.1.105.',
        category: 'Information Security Breach',
        severity: 'high',
        status: 'investigating',
        createdAt: new Date(Date.now() - 3600000 * 2) // 2 hours ago
    },
    {
        _id: 'RPT-2026-002',
        title: 'Phishing Pattern: "IT-SystemHandshake"',
        description: 'Institutional-wide phishing campaign identified. Direct-action emails from spoofed "admin@hypershield-net" domain. Targeted executive leadership segments.',
        category: 'Advanced Phishing / Smishing',
        severity: 'medium',
        status: 'reported',
        createdAt: new Date(Date.now() - 3600000 * 5) // 5 hours ago
    },
    {
        _id: 'RPT-2026-003',
        title: 'Ransomware "LockBit" Execution Trace',
        description: 'Endpoint WP-0023 infected with LockBit 3.0 variant. Primary file-server encrypted. Segment isolated within 4.2ms of detection.',
        category: 'Malicious Code Execution',
        severity: 'critical',
        status: 'investigating',
        createdAt: new Date(Date.now() - 3600000 * 12) // 12 hours ago
    }
];

exports.createReport = async (req, res) => {
    try {
        const { title, description, category, severity, location } = req.body;
        const evidence = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        // Persistence Strategy: If DB is down, use Mock store
        if (process.env.USE_MOCK_DATA === 'true') {
            const newReport = {
                _id: `RPT-2026-${Math.floor(100 + Math.random() * 900)}`,
                title,
                description,
                category,
                severity,
                evidence,
                location,
                status: 'reported',
                createdAt: new Date()
            };
            MOCK_REPORTS.unshift(newReport);
            console.log(`PERSISTENCE_LOG: Incident committed to memory segment: ${newReport._id}`);
            return res.status(201).json(newReport);
        }

        const report = new Report({
            reporter: req.user.id,
            title,
            description,
            category,
            severity,
            evidence,
            location
        });
        await report.save();
        res.status(201).json(report);
    } catch (err) {
        console.error("DATA_ERR: Failed to commit report to storage cluster.", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReports = async (req, res) => {
    try {
        if (process.env.USE_MOCK_DATA === 'true') {
            return res.json(MOCK_REPORTS);
        }

        let query = {};
        if (req.user.role === 'citizen') {
            query.reporter = req.user.id;
        }
        const reports = await Report.find(query).populate('reporter', 'name email role').sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        // Fallback for DB connectivity loss
        res.json(MOCK_REPORTS);
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (process.env.USE_MOCK_DATA === 'true') {
            const report = MOCK_REPORTS.find(r => r._id === id);
            if (report) {
                report.status = status;
                report.updatedAt = new Date();
                return res.json(report);
            }
        }

        if (req.user.role === 'citizen' && status !== 'resolved') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const report = await Report.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
