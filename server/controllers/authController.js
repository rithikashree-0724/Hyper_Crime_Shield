const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, badgeId } = req.body;

        if (process.env.USE_MOCK_DATA === 'true') {
            const token = jwt.sign({ id: 'mockuser', role: role || 'citizen' }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
            return res.status(201).json({ token, user: { id: 'mockuser', name, email, role: role || 'citizen' } });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, role, badgeId });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name, email, role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (process.env.USE_MOCK_DATA === 'true') {
            const token = jwt.sign({ id: 'mockuser', role: 'investigator' }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
            return res.json({ token, user: { id: 'mockuser', name: 'Mock Officer', email, role: 'investigator' } });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
