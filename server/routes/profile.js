const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const otplib = require('otplib');
const qrcode = require('qrcode');
const bcrypt = require('bcryptjs'); // Needed for password change

// Get Profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -twoFactorSecret');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Profile
router.put('/', auth, async (req, res) => {
    try {
        const { name, email, phone, profileImage } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'Email already in use' });
            user.email = email;
            user.isVerified = false; // Reset verification on email change
        }
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;

        await user.save();
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

        user.password = newPassword; // Pre-save hook will hash it
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Generate 2FA Secret
router.post('/2fa/generate', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const secret = otplib.authenticator.generateSecret();

        user.twoFactorSecret = secret;
        await user.save();

        const otpauth = otplib.authenticator.keyuri(user.email, 'HyperCrimeShield', secret);
        const imageUrl = await qrcode.toDataURL(otpauth);

        res.json({ secret, qrCode: imageUrl });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Verify 2FA & Enable
router.post('/2fa/verify', auth, async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id);

        const isValid = otplib.authenticator.check(token, user.twoFactorSecret);
        if (!isValid) return res.status(400).json({ message: 'Invalid token' });

        user.isTwoFactorEnabled = true;
        await user.save();
        res.json({ message: '2FA Enabled Successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Login History
router.get('/login-history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('loginHistory');
        res.json(user.loginHistory);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
