const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, badgeId, phone } = req.body;

        if (process.env.USE_MOCK_DATA === 'true') {
            const mockToken = jwt.sign({ id: 'mock_' + (role || 'citizen'), role: role || 'citizen' }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
            return res.status(201).json({
                token: mockToken,
                user: { id: 'mock_' + (role || 'citizen'), name, email, role: role || 'citizen', isVerified: true }
            });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Citizens are verified by default (simplification), others need approval
        const isVerified = role === 'citizen';
        const kycStatus = role === 'investigator' ? 'pending' : 'verified';

        user = new User({
            name,
            email,
            password,
            role,
            badgeId: role === 'investigator' ? badgeId : undefined,
            phone,
            isVerified,
            kycStatus
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name, email, role, isVerified, kycStatus } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, code } = req.body;

        if (process.env.USE_MOCK_DATA === 'true') {
            // Auto-detect role from email or default to citizen
            let role = 'citizen';
            let name = email.split('@')[0];

            if (email.includes('admin')) {
                role = 'admin';
                name = 'System Admin';
            } else if (email.includes('rajesh') || email.includes('officer') || email.includes('investigator')) {
                role = 'investigator';
                name = 'Inspector ' + name;
            } else {
                name = name.charAt(0).toUpperCase() + name.slice(1);
            }

            const mockUser = { id: 'mock_' + role + '_' + Date.now(), name, email, role };
            const token = jwt.sign({ id: mockUser.id, role: mockUser.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
            return res.json({ token, user: mockUser });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.isSuspended) {
            return res.status(403).json({ message: 'Account suspended. Contact Admin.' });
        }

        // 2FA Check
        if (user.isTwoFactorEnabled) {
            if (!code) return res.status(400).json({ message: '2FA code required', isTwoFactorEnabled: true });

            const otplib = require('otplib');
            const isValid = otplib.authenticator.check(code, user.twoFactorSecret);
            if (!isValid) return res.status(400).json({ message: 'Invalid 2FA code' });
        }

        // Log Login History
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        user.loginHistory.push({ ip, device: req.headers['user-agent'] });
        // Keep only last 10 logins
        if (user.loginHistory.length > 10) {
            user.loginHistory.shift();
        }
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role, isTwoFactorEnabled: user.isTwoFactorEnabled } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
