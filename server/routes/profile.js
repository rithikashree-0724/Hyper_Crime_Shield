const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { generateOTP, sendMockEmail } = require('../utils/otpService');
const { sendEmail, templates } = require('../utils/emailService');

// Get Profile
router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'loginOtp', 'loginOtpExpires'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
});

// Update Profile (with file upload support)
router.put('/', auth, upload.single('profileImage'), async (req, res, next) => {
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
            user.profileImage = req.file.path.replace(/\\/g, '/'); // Store relative path
        }

        await user.save();
        res.json({ success: true, message: 'Profile updated', data: user });
    } catch (err) {
        next(err);
    }
});

// Change Password
router.put('/change-password', auth, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!await user.comparePassword(currentPassword)) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
});

// Setup 2FA (Send verification OTP)
router.post('/2fa/setup', auth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        const generatedOtp = generateOTP();
        user.loginOtp = generatedOtp;
        user.loginOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        // Send OTP (Real Service if configured, else Mock)
        try {
            const { subject, text, html } = templates.otpEntry(generatedOtp);
            await sendEmail(user.email, subject, text, html);
        } catch (mailErr) {
            console.warn(`[2FA SETUP] falling back to mock email due to error: ${mailErr.message}`);
            sendMockEmail(user.email, generatedOtp);
        }

        res.json({ success: true, message: 'Verification OTP sent to your email' });
    } catch (err) {
        next(err);
    }
});

// Verify and Enable 2FA
router.post('/2fa/verify', auth, async (req, res, next) => {
    try {
        const { code } = req.body;
        const user = await User.findByPk(req.user.id);

        console.log(`[PROFILE 2FA VERIFY] User: ${user.email}, Received Code: ${code}, Stored OTP: ${user.loginOtp}, Expires: ${user.loginOtpExpires}`);

        if (user.loginOtp !== code || new Date() > user.loginOtpExpires) {
            console.log(`[PROFILE 2FA FAILED] Mismatch or Timeout. User: ${user.email}`);
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        console.log(`[PROFILE 2FA SUCCESS] User: ${user.email}`);

        user.isTwoFactorEnabled = true;
        user.loginOtp = null;
        user.loginOtpExpires = null;
        await user.save();

        res.json({ success: true, message: '2FA Enabled Successfully', data: { isTwoFactorEnabled: true } });
    } catch (err) {
        next(err);
    }
});
// Disable 2FA
router.post('/2fa/disable', auth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        user.isTwoFactorEnabled = false;
        await user.save();
        res.json({ success: true, message: '2FA Disabled' });
    } catch (err) {
        next(err);
    }
});

// Get Login History
router.get('/login-history', auth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['loginHistory']
        });
        res.json({ success: true, data: user.loginHistory || [] });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
