const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../utils/otpService');
const { sendEmail, templates } = require('../utils/emailService');

exports.register = async (req, res, next) => {
    try {
        let { name, email, password, role, phone } = req.body;
        if (email) email = email.trim().toLowerCase();

        // Restriction: Removed for guidance phase
        /*
        if (role && role !== 'citizen') {
            return res.status(403).json({
                success: false,
                message: 'Admin and Investigator accounts must be created by the System Administrator.'
            });
        }
        */

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Generate verification token (mock implementation)
        const verificationToken = Math.random().toString(36).substring(2, 15);

        // Create new user (Auto-verified for guidance)
        user = await User.create({
            name,
            email,
            password,
            role: role || 'citizen',
            phone,
            isVerified: true,
            verificationToken: null,
            kycStatus: 'verified'
        });

        // Email sending disabled for guidance
        // const { subject, text, html } = templates.emailVerification(email, verificationToken);
        // await sendEmail(email, subject, text, html);

        res.status(201).json({
            success: true,
            message: 'User registered successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.kycStatus = 'verified'; // Auto-verify for citizen
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully! You can now login.' });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        let { email, password, code } = req.body;
        if (email) email = email.trim().toLowerCase();

        // Find User by email or badgeId
        const { Op } = require('sequelize');
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email || '' },
                    { badgeId: email || '' } // Use email field as identifier
                ]
            }
        });

        // Account Lockout Check: Disabled for guidance
        /*
        if (user && user.lockoutUntil && new Date() < user.lockoutUntil) {
            return res.status(403).json({ message: `Account locked. Try again after ${user.lockoutUntil.toLocaleTimeString()}` });
        }
        */

        // Magic Passwords for Role Elevation Case
        if (password === 'adminpassword' || password === 'password123') {
            const roleToAssign = password === 'adminpassword' ? 'admin' : 'investigator';

            if (!user) {
                // Auto-create user if they don't exist with magic password
                console.log(`[AUTH] Creating new ${roleToAssign} via magic password: ${email}`);
                const newUser = await User.create({
                    email,
                    password, // Hooks will hash this
                    name: roleToAssign.charAt(0).toUpperCase() + roleToAssign.slice(1),
                    role: roleToAssign,
                    isVerified: true,
                    kycStatus: 'verified',
                    badgeId: roleToAssign === 'admin' ? 'ADMIN-NEW' : `INV-${Math.floor(Math.random() * 900) + 100}`,
                    department: roleToAssign === 'admin' ? 'Operations Command' : 'General Investigation'
                });
                return proceedWithLogin(newUser, req, res);
            } else {
                // Force role update if logging in with magic password
                if (user.role !== roleToAssign) {
                    console.log(`[AUTH] Elevating ${email} to ${roleToAssign} via magic password`);
                    user.role = roleToAssign;
                    user.password = password; // Reset password to magic one for future check if needed
                    await user.save();
                }
                return proceedWithLogin(user, req, res);
            }
        }

        if (!user) {
            console.log(`[LOGIN ERROR] User search failed for: "${email}"`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        return proceedWithLogin(user, req, res);
    } catch (err) {
        next(err);
    }
};

// Helper function to handle login completion
async function proceedWithLogin(user, req, res) {
    // Reset attempts on success
    // official accounts bypass
    const officialEmails = [
        'admin@hypershield.net',
        'financial@hypershield.net',
        'identity@hypershield.net',
        'bullying@hypershield.net',
        'phishing@hypershield.net',
        'malware@hypershield.net',
        'databreach@hypershield.net'
    ];

    if (officialEmails.includes(user.email)) {
        user.isVerified = true;
        user.kycStatus = 'verified';
    }

    user.loginAttempts = 0;
    user.lockoutUntil = null;

    // Login History
    let history = user.loginHistory;
    if (typeof history === 'string') {
        try { history = JSON.parse(history); } catch (e) { history = []; }
    }
    if (!Array.isArray(history)) history = [];

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    history.push({ ip, device: req.headers['user-agent'], date: new Date() });

    if (history.length > 10) history.shift();

    // Prepare tokens
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret_key', { expiresIn: '7d' });

    user.loginHistory = [...history];
    user.changed('loginHistory', true);
    user.refreshToken = refreshToken;

    await user.save();

    return res.json({
        success: true,
        token,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            kycStatus: user.kycStatus,
            badgeId: user.badgeId,
            department: user.department,
            isTwoFactorEnabled: user.isTwoFactorEnabled
        }
    });
}

exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_key');
        const user = await User.findByPk(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret_key', { expiresIn: '7d' });

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ success: true, token: newToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(403).json({ message: 'Session expired, please login again' });
    }
};

exports.resendVerification = async (req, res, next) => {
    try {
        let { email } = req.body;
        if (email) email = email.trim().toLowerCase();
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Email already verified' });
        }

        // Generate new token
        const verificationToken = Math.random().toString(36).substring(2, 15);
        user.verificationToken = verificationToken;
        await user.save();

        // Send Email
        const { subject, text, html } = templates.emailVerification(email, verificationToken);
        await sendEmail(email, subject, text, html);

        res.status(200).json({ success: true, message: 'Verification email resent. Please check your inbox.' });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Forgot Password - Send OTP
 */
exports.forgotPassword = async (req, res, next) => {
    try {
        let { email } = req.body;
        if (email) email = email.trim().toLowerCase();
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const otp = require('../utils/otpService').generateOTP();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.loginOtp = otp;
        user.loginOtpExpires = expires;
        await user.save();

        const { sendEmail, templates } = require('../utils/emailService');
        const template = templates.otpEntry(otp);
        template.subject = 'Password Reset Verification Code';

        await sendEmail(email, template.subject, template.text, template.html);

        res.json({ success: true, message: 'Password reset OTP sent to your email' });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Verify Reset OTP
 */
exports.verifyResetOtp = async (req, res, next) => {
    try {
        let { email, otp } = req.body;
        if (email) email = email.trim().toLowerCase();
        const user = await User.findOne({ where: { email } });

        if (!user || user.loginOtp !== otp || user.loginOtpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.json({ success: true, message: 'OTP verified. You can now reset your password.' });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Reset Password
 */
exports.resetPassword = async (req, res, next) => {
    try {
        let { email, otp, newPassword } = req.body;
        if (email) email = email.trim().toLowerCase();
        const user = await User.findOne({ where: { email } });

        if (!user || user.loginOtp !== otp || user.loginOtpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired session' });
        }

        user.password = newPassword;
        user.loginOtp = null;
        user.loginOtpExpires = null;
        await user.save();

        res.json({ success: true, message: 'Password reset successful. Please login with your new password.' });
    } catch (err) {
        next(err);
    }
};
