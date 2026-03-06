const fs = require('fs');
const path = require('path');
const { AuditLog } = require('../models');

// Mock Blocked IPs List (In real app, use Redis or DB)
const BLOCKED_IPS = ['192.168.0.99'];

exports.ipBlocker = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (BLOCKED_IPS.includes(ip)) {
        return res.status(403).json({ message: 'Access Denied: Your IP is blocked.' });
    }
    next();
};

exports.activityLogger = async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Log to file for redundancy
    const log = `[${new Date().toISOString()}] IP: ${ip} Method: ${req.method} URL: ${req.url}\n`;
    fs.appendFile(path.join(__dirname, '../logs/activity.log'), log, (err) => {
        if (err) console.error('Logging failed', err);
    });

    // Persistent Log to Database (Async, don't block request)
    try {
        if (req.method !== 'GET') {
            // Attempt to extract resource and ID from URL
            const urlParts = req.url.split('/').filter(p => p);
            const resource = urlParts[1] || 'Unknown'; // e.g., /api/reports -> reports
            const resourceId = urlParts[2] || null;

            AuditLog.create({
                userId: req.user ? req.user.id : null,
                action: `${req.method} ${req.url}`,
                resource: resource,
                resourceId: resourceId,
                ipAddress: ip,
                userAgent: req.headers['user-agent'],
                details: req.body ? JSON.stringify(req.body) : null // Store payload for investigation
            }).catch(err => console.error('AuditLog DB create failed', err));
        }
    } catch (err) {
        console.error('AuditLog middleware error', err);
    }

    next();
};
