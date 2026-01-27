const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Sequelize model

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

        // Check for mock
        if (decoded.id && decoded.id.toString().startsWith('mock_')) {
            req.user = decoded;
            return next();
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        if (process.env.USE_MOCK_DATA === 'true') {
            req.user = { id: 'mockuser', role: 'citizen' };
            return next();
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (process.env.USE_MOCK_DATA === 'true') return next(); // Bypass for mock

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};
