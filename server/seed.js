const mongoose = require('mongoose');
const User = require('./models/User');
const Report = require('./models/Report');
const Investigation = require('./models/Investigation');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crime-shield');
        console.log('Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Report.deleteMany({});
        await Investigation.deleteMany({});

        // 1. Create Admin
        const admin = new User({
            name: 'System Admin',
            email: 'admin@hypershield.net',
            password: 'adminpassword',
            role: 'admin',
            isVerified: true
        });
        await admin.save();
        console.log('Admin account created: admin@hypershield.net / adminpassword');

        // 2. Create Investigator
        const officer = new User({
            name: 'Inspector Rajesh Kumar',
            email: 'rajesh@hypershield.net',
            password: 'password123',
            role: 'investigator',
            badgeId: 'HC-9920-IND',
            kycStatus: 'verified',
            isVerified: true
        });
        await officer.save();
        console.log('Investigator created: rajesh@hypershield.net / password123');

        // 3. Create Citizen
        const citizen = new User({
            name: 'Aravind Swamy',
            email: 'aravind@gmail.com',
            password: 'password123',
            role: 'citizen',
            isVerified: true,
            phone: '+91 94444-55555'
        });
        await citizen.save();
        console.log('Citizen created: aravind@gmail.com / password123');

        // 4. Create sample reports
        const reports = [
            {
                reporter: citizen._id,
                title: 'Suspicious Banking Link',
                description: 'Received a WhatsApp message claiming to be from SBI asking for PAN update. Link seems fraudulent.',
                category: 'Advanced Phishing / Smishing',
                severity: 'medium',
                status: 'investigating',
                location: 'Chennai, India',
                complaintId: 'CR-100201'
            },
            {
                reporter: citizen._id,
                title: 'E-commerce Scam',
                description: 'Paid Rs. 5000 for a smartphone on a fake Instagram store. Product never delivered and account blocked me.',
                category: 'Data Exfiltration Event',
                severity: 'high',
                status: 'reported',
                location: 'Bangalore, India',
                complaintId: 'CR-100202'
            }
        ];

        const createdReports = await Report.insertMany(reports);
        console.log('Sample reports created');

        // 5. Assign first report to Investigator
        const investigation = new Investigation({
            report: createdReports[0]._id,
            investigators: [officer._id],
            status: 'active',
            notes: [{ content: 'Initial assessment completed. Phishing domain flagged.', author: officer._id }]
        });
        await investigation.save();
        console.log('Investigation case assigned to Rajesh Kumar');

        console.log('--- SEEDING COMPLETE ---');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
