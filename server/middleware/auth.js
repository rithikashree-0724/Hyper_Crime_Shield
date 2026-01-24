const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Demo/Mock bypass
    if (token === 'demo-token' || process.env.USE_MOCK_DATA === 'true') {
        req.user = { id: 'mockuser', role: 'investigator' };
        return next();
    }

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
