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
        const users = await User.count();
        const reports = await Report.count();
        const investigations = await Investigation.count();
        res.json({ users, reports, investigations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Pending Users (Investigators requiring approval)
router.get('/users/pending', auth, checkAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            where: { kycStatus: 'pending', role: 'investigator' },
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve User
router.patch('/users/:id/approve', auth, checkAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.kycStatus = 'verified';
        user.isVerified = true;
        await user.save();

        res.json({ message: 'User approved', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
