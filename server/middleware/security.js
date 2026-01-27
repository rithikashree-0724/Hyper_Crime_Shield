const fs = require('fs');
const path = require('path');

// Mock Blocked IPs List (In real app, use Redis or DB)
const BLOCKED_IPS = ['192.168.0.99'];

exports.ipBlocker = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (BLOCKED_IPS.includes(ip)) {
        return res.status(403).json({ message: 'Access Denied: Your IP is blocked.' });
    }
    next();
};

exports.activityLogger = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const log = `[${new Date().toISOString()}] IP: ${ip} Method: ${req.method} URL: ${req.url}\n`;

    // Append to local log file
    fs.appendFile(path.join(__dirname, '../logs/activity.log'), log, (err) => {
        if (err) console.error('Logging failed', err);
    });
    next();
};
