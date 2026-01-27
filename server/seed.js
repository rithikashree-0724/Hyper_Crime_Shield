const { sequelize } = require('./config/db');
const User = require('./models/User');
const Report = require('./models/Report');
const Investigation = require('./models/Investigation');
require('dotenv').config();

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQLite for seeding');

        // Clear existing data (Note: truncate: true might fail if foreign keys exist)
        // Order matters for deletion
        await Investigation.destroy({ where: {} });
        await Report.destroy({ where: {} });
        await User.destroy({ where: {} });

        // 1. Create Admin
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@hypershield.net',
            password: 'adminpassword',
            role: 'admin',
            isVerified: true
        });
        console.log('Admin account created: admin@hypershield.net / adminpassword');

        // 2. Create Investigator
        const officer = await User.create({
            name: 'Inspector Rajesh Kumar',
            email: 'rajesh@hypershield.net',
            password: 'password123',
            role: 'investigator',
            badgeId: 'HC-9920-IND',
            isVerified: true,
            kycStatus: 'verified'
        });
        console.log('Investigator created: rajesh@hypershield.net / password123');

        // 3. Create Citizen
        const citizen = await User.create({
            name: 'Aravind Swamy',
            email: 'aravind@gmail.com',
            password: 'password123',
            role: 'citizen',
            isVerified: true,
            phone: '+91 9344205572'
        });
        console.log('Citizen created: aravind@gmail.com / password123');

        // 4. Create sample reports
        const reports = [
            {
                userId: citizen.id,
                title: 'Suspicious Banking Link',
                description: 'Received a WhatsApp message claiming to be from SBI asking for PAN update. Link seems fraudulent.',
                category: 'Advanced Phishing / Smishing',
                severity: 'medium',
                status: 'investigating',
                location: 'Chennai, India',
                complaintId: 'CR-100201'
            },
            {
                userId: citizen.id,
                title: 'E-commerce Scam',
                description: 'Paid Rs. 5000 for a smartphone on a fake Instagram store. Product never delivered and account blocked me.',
                category: 'Data Exfiltration Event',
                severity: 'high',
                status: 'pending',
                location: 'Bangalore, India',
                complaintId: 'CR-100202'
            }
        ];

        const createdReports = [];
        for (const r of reports) {
            const report = await Report.create(r);
            createdReports.push(report);
        }
        console.log('Sample reports created');

        // 5. Assign first report to Investigator
        await Investigation.create({
            reportId: createdReports[0].id,
            investigatorIds: [officer.id],
            status: 'active',
            notes: [{ content: 'Initial assessment completed. Phishing domain flagged.', authorId: officer.id, date: new Date() }]
        });
        console.log('Investigation case assigned to Rajesh Kumar');

        console.log('--- SEEDING COMPLETE ---');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
