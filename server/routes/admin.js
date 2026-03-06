const express = require('express');
const router = express.Router();
const { User, Report, AuditLog } = require('../models');
const auth = require('../middleware/auth');
const Investigation = require('../models/Investigation');

// Middleware to ensure admin
const checkAdmin = auth.authorize('admin');

// Get System Stats
router.get('/stats', auth, checkAdmin, async (req, res, next) => {
    try {
        const users = await User.count();
        const reports = await Report.count();
        const investigations = await Investigation.count();
        res.json({ success: true, data: { users, reports, investigations } });
    } catch (err) {
        next(err);
    }
});

// Get Pending Users (Investigators requiring approval)
router.get('/users/pending', auth, checkAdmin, async (req, res, next) => {
    try {
        const users = await User.findAll({
            where: { kycStatus: 'pending', role: 'investigator' },
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
});

// Approve User
router.patch('/users/:id/approve', auth, checkAdmin, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.kycStatus = 'verified';
        user.isVerified = true;
        await user.save();

        res.json({ success: true, message: 'User approved', data: user });
    } catch (err) {
        next(err);
    }
});

// Get All Users (Admin only)
router.get('/users', auth, auth.authorize('admin'), async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'refreshToken', 'loginOtp'] }
        });
        res.json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
});

// Verify/Approve User
router.put('/users/:id/verify', auth, auth.authorize('admin'), async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isVerified = true;
        user.kycStatus = 'verified';
        await user.save();

        res.json({ success: true, message: 'User verified successfully', data: user });
    } catch (err) {
        next(err);
    }
});

// Update User Role
router.put('/users/:id/role', auth, auth.authorize('admin'), async (req, res, next) => {
    try {
        const { role } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();

        res.json({ success: true, message: `Role updated to ${role}`, data: user });
    } catch (err) {
        next(err);
    }
});

// Block/Soft Delete User
router.delete('/users/:id', auth, auth.authorize('admin'), async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy(); // Soft delete due to paranoid: true
        res.json({ success: true, message: 'User blocked (soft-deleted)' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
