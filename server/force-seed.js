const { User } = require('./models');
const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('--- FORCED SEEDING START (EXPLICIT HASH) ---');
        await sequelize.sync({ force: true });

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const invPassword = await bcrypt.hash('password123', salt);
        const adminPassword = await bcrypt.hash('adminpassword', salt);

        // 1. Admin
        await User.create({
            name: 'System Admin',
            email: 'admin@hypershield.net',
            password: adminPassword,
            role: 'admin',
            isVerified: true,
            kycStatus: 'verified',
            badgeId: 'AD-001',
            department: 'Operations Command'
        }, { hooks: false });

        // 2. Financial Fraud
        await User.create({
            name: 'Financial Investigator',
            email: 'financial@hypershield.net',
            password: invPassword,
            role: 'investigator',
            isVerified: true,
            kycStatus: 'verified',
            badgeId: 'FIN-101',
            department: 'Financial Fraud'
        }, { hooks: false });

        // 3. Identity Theft
        await User.create({
            name: 'Identity Specialist',
            email: 'identity@hypershield.net',
            password: invPassword,
            role: 'investigator',
            isVerified: true,
            kycStatus: 'verified',
            badgeId: 'IDT-201',
            department: 'Identity Theft'
        }, { hooks: false });

        // 4. Cyber Bullying
        await User.create({
            name: 'Bullying Response',
            email: 'bullying@hypershield.net',
            password: invPassword,
            role: 'investigator',
            isVerified: true,
            kycStatus: 'verified',
            badgeId: 'BUL-301',
            department: 'Cyber Bullying'
        }, { hooks: false });

        // 5. Phishing Attack
        await User.create({
            name: 'Phishing Analyst',
            email: 'phishing@hypershield.net',
            password: invPassword,
            role: 'investigator',
            isVerified: true,
            kycStatus: 'verified',
            badgeId: 'PHS-401',
            department: 'Phishing Attack'
        }, { hooks: false });

        // 6. Malware & Virus
        await User.create({
            name: 'Malware Specialist',
            email: 'malware@hypershield.net',
            password: invPassword,
            role: 'investigator',
            isVerified: true,
            kycStatus: 'verified',
            badgeId: 'MAL-501',
            department: 'Malware & Virus'
        }, { hooks: false });

        // 7. Data Breach
        await User.create({
            name: 'Data Breach Response',
            email: 'databreach@hypershield.net',
            password: invPassword,
            role: 'investigator',
            isVerified: true,
            kycStatus: 'verified',
            badgeId: 'DTB-601',
            department: 'Data Breach'
        }, { hooks: false });

        // Extra: Test Citizen
        await User.create({
            name: 'Aravind Swamy',
            email: 'aravind@gmail.com',
            password: invPassword,
            role: 'citizen',
            isVerified: true,
            kycStatus: 'verified'
        }, { hooks: false });

        console.log('[SUCCESS] All 7 official accounts and test citizen created and verified.');
    } catch (err) {
        console.error('[SEED ERROR]', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
}
seed();
