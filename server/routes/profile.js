const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { generateOTP, sendMockEmail } = require('../utils/otpService');

// Get Profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'loginOtp', 'loginOtpExpires'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Profile (with file upload support)
router.put('/', auth, upload.single('profileImage'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) return res.status(400).json({ message: 'Email already in use' });
            user.email = email;
            user.isVerified = false;
        }
        if (phone) user.phone = phone;

        // Handle File Upload
        if (req.file) {
            user.profileImage = `http://localhost:5001/${req.file.path.replace(/\\/g, '/')}`; // Convert path to URL
        }

        await user.save();
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!await user.comparePassword(currentPassword)) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Setup 2FA (Send verification OTP)
router.post('/2fa/setup', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        const generatedOtp = generateOTP();
        user.loginOtp = generatedOtp;
        user.loginOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        // Send OTP (Mock)
        sendMockEmail(user.email, generatedOtp);

        res.json({ message: 'Verification OTP sent to your email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Verify and Enable 2FA
router.post('/2fa/verify', auth, async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findByPk(req.user.id);

        if (user.loginOtp !== code || new Date() > user.loginOtpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isTwoFactorEnabled = true;
        user.loginOtp = null;
        user.loginOtpExpires = null;
        await user.save();

        res.json({ message: '2FA Enabled Successfully', user: { isTwoFactorEnabled: true } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
// Disable 2FA
router.post('/2fa/disable', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        user.isTwoFactorEnabled = false;
        await user.save();
        res.json({ message: '2FA Disabled' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Login History
router.get('/login-history', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['loginHistory']
        });
        res.json(user.loginHistory || []);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
