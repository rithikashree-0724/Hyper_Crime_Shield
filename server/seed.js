const mongoose = require('mongoose');
const User = require('./models/User');
const Report = require('./models/Report');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crime-shield');
        console.log('Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Report.deleteMany({});

        // Create a dummy officer
        const officer = new User({
            name: 'Det. Sarah Connors',
            email: 'officer@cyberguard.gov',
            password: 'password123',
            role: 'investigator',
            badgeId: 'HC-9920-X'
        });
        await officer.save();
        console.log('Officer created');

        // Create sample reports
        const reports = [
            {
                reporter: officer._id,
                title: 'Unauthorized Database Access',
                description: 'Suspicious IP 192.168.1.105 attempted to bypass firewall on the core SQL server.',
                category: 'Intrusion',
                severity: 'high',
                status: 'investigating'
            },
            {
                reporter: officer._id,
                title: 'Phishing Campaign Detected',
                description: 'Bulk emails from "internal-it@security-cyber.com" targetting HR department.',
                category: 'Phishing',
                severity: 'medium',
                status: 'reported'
            },
            {
                reporter: officer._id,
                title: 'Ransomware "LockBit" Execution',
                description: 'Endpoint WP-0023 infected with LockBit 3.0. Files encrypted. Initial isolation complete.',
                category: 'Ransomware',
                severity: 'critical',
                status: 'investigating'
            }
        ];

        await Report.insertMany(reports);
        console.log('Sample reports created');

        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
