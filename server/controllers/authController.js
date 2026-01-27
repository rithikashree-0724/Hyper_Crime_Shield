const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP, sendMockEmail } = require('../utils/otpService');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, badgeId, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Create new user (Sequelize hooks will hash password)
        user = await User.create({
            name,
            email,
            password,
            role: role || 'citizen',
            badgeId: role === 'investigator' ? badgeId : null,
            phone,
            isVerified: role === 'citizen', // Auto-verify citizens for now
            kycStatus: role === 'citizen' ? 'verified' : 'pending'
        });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        // Return user data (exclude password)
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(201).json({ token, user: userResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, code } = req.body;

        // Find User
        const user = await User.findOne({ where: { email } });

        // Check password using instance method
        // Check password
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2FA Logic (Email OTP)
        if (user.isTwoFactorEnabled) {
            // If code is provided, verify it
            if (code) {
                if (user.loginOtp !== code || new Date() > user.loginOtpExpires) {
                    return res.status(400).json({ message: 'Invalid or expired OTP' });
                }
                // Clear OTP after success
                user.loginOtp = null;
                user.loginOtpExpires = null;
            } else {
                // Generate and send OTP
                const generatedOtp = generateOTP();
                user.loginOtp = generatedOtp;
                user.loginOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
                await user.save();

                // Mock Sending Email
                sendMockEmail(user.email, generatedOtp);

                return res.status(200).json({
                    message: `OTP sent to your registered email: ${user.email}`,
                    requires2FA: true
                });
            }
        }

        // Login History
        // Initialize if null
        let history = user.loginHistory || [];
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        history.push({ ip, device: req.headers['user-agent'], date: new Date() });

        // Limit history
        if (history.length > 10) history.shift();

        // Update user
        user.loginHistory = history;
        // Sequelize detects JSON changes? Maybe need explicit changed() call or new array reference.
        user.set('loginHistory', history);
        await user.save();

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isTwoFactorEnabled: user.isTwoFactorEnabled } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
