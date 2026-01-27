const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Report = require('../models/Report');
const Investigation = require('../models/Investigation');

// Middleware to ensure admin
const checkAdmin = auth.authorize('admin');

// Get System Stats
router.get('/stats', auth, checkAdmin, async (req, res) => {
    try {
        if (process.env.USE_MOCK_DATA === 'true') {
            return res.json({ users: 50, reports: 120, investigations: 45 });
        }
        const users = await User.countDocuments();
        const reports = await Report.countDocuments();
        const investigations = await Investigation.countDocuments();
        res.json({ users, reports, investigations });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Pending Users (Investigators requiring approval)
router.get('/users/pending', auth, checkAdmin, async (req, res) => {
    try {
        const users = await User.find({ kycStatus: 'pending', role: 'investigator' });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve User
router.patch('/users/:id/approve', auth, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.kycStatus = 'verified';
        user.isVerified = true;
        await user.save();

        res.json({ message: 'User approved', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
