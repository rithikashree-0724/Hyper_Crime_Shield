const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
            isVerified: role === 'citizen' // Auto-verify citizens for now
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
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2FA Logic (if enabled)
        if (user.isTwoFactorEnabled) {
            if (!code) return res.status(400).json({ message: '2FA code required', isTwoFactorEnabled: true });

            const otplib = require('otplib');
            // Assuming twoFactorSecret is stored.
            // Note: If user somehow has 2FA enabled but no secret, this might fail.
            const isValid = otplib.authenticator.check(code, user.twoFactorSecret);
            if (!isValid) return res.status(400).json({ message: 'Invalid 2FA code' });
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
