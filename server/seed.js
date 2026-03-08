const { sequelize } = require('./config/db');
const { User, Report, Investigation } = require('./models');
const fs = require('fs');
require('dotenv').config();

const logFile = 'seed_log.txt';
const log = (msg) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    console.log(msg);
};

const seedData = async () => {
    try {
        fs.writeFileSync(logFile, '--- STARTING SEED ---\n');
        await sequelize.authenticate();
        log('Connected to SQLite for seeding');

        // Force Sync to ensure tables exist
        await sequelize.sync({ force: true });
        log('Database Tables Force-Synced (all data cleared)');

        // 1. Create Admin
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@hypershield.net',
            password: 'adminpassword',
            role: 'admin',
            isVerified: true
        });
        log('Admin account created: admin@hypershield.net / adminpassword');

        // 2. Create 6 Specific Investigators for the major categories
        const investigators = [
            {
                name: 'Financial Fraud Investigator',
                email: 'financial@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-FIN-01',
                isVerified: true, kycStatus: 'verified'
            },
            {
                name: 'Identity Theft Investigator',
                email: 'identity@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-ID-02',
                isVerified: true, kycStatus: 'verified'
            },
            {
                name: 'Cyber Bullying Investigator',
                email: 'bullying@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-CB-03',
                isVerified: true, kycStatus: 'verified'
            },
            {
                name: 'Phishing Attack Investigator',
                email: 'phishing@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-PH-04',
                isVerified: true, kycStatus: 'verified'
            },
            {
                name: 'Malware & Virus Investigator',
                email: 'malware@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-MV-05',
                isVerified: true, kycStatus: 'verified'
            },
            {
                name: 'Data Breach Investigator',
                email: 'databreach@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-DB-06',
                isVerified: true, kycStatus: 'verified'
            },
            {
                name: 'Social Media Crime Investigator',
                email: 'socialmedia@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-SM-07',
                isVerified: true, kycStatus: 'verified'
            },
            {
                name: 'Other Cyber Crime Investigator',
                email: 'othercyber@hypershield.net',
                password: 'password123',
                role: 'investigator',
                badgeId: 'INV-OC-08',
                isVerified: true, kycStatus: 'verified'
            }
        ];

        for (const inv of investigators) {
            await User.create(inv);
            log(`Investigator created: ${inv.email} / ${inv.password}`);
        }

        // 3. Create a Test Citizen (Citizens will normally register themselves)
        const citizen = await User.create({
            name: 'Aravind Swamy',
            email: 'aravind@gmail.com',
            password: 'password123',
            role: 'citizen',
            isVerified: true,
            phone: '+91 9344205572'
        });
        log('Citizen created: aravind@gmail.com / password123');

        // 4. Create sample reports
        const reports = [
            {
                userId: citizen.id,
                title: 'Suspicious Banking Link',
                description: 'Received a WhatsApp message claiming to be from SBI asking for PAN update. Link seems fraudulent.',
                category: 'Phishing Attack',
                severity: 'medium',
                status: 'investigating',
                location: 'Chennai, India',
                complaintId: 'CR-100201'
            }
        ];

        for (const r of reports) {
            await Report.create(r);
        }
        log('Sample reports created');

        log('--- SEEDING COMPLETE ---');
        process.exit(0);
    } catch (err) {
        log('Seeding error: ' + err.message);
        if (err.stack) log(err.stack);
        process.exit(1);
    }
};

seedData();
