const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const auth = require('../middleware/auth');

// Get all notifications for current user
router.get('/', auth, async (req, res, next) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        notification.isRead = true;
        await notification.save();
        res.json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
