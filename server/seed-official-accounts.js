const User = require('./models/User');
const { sequelize } = require('./config/db');

const officialAccounts = [
    {
        name: 'System Administrator',
        email: 'admin@hypershield.net',
        password: 'adminpassword',
        role: 'admin',
        badgeId: 'ADMIN-01',
        department: 'Operations Command',
        isVerified: true,
        kycStatus: 'verified'
    },
    {
        name: 'Financial Fraud Investigator',
        email: 'financial@hypershield.net',
        password: 'password123',
        role: 'investigator',
        badgeId: 'FIN-101',
        department: 'Financial Fraud',
        isVerified: true,
        kycStatus: 'verified'
    },
    {
        name: 'Identity Theft Investigator',
        email: 'identity@hypershield.net',
        password: 'password123',
        role: 'investigator',
        badgeId: 'IDT-201',
        department: 'Identity Theft',
        isVerified: true,
        kycStatus: 'verified'
    },
    {
        name: 'Cyber Bullying Investigator',
        email: 'bullying@hypershield.net',
        password: 'password123',
        role: 'investigator',
        badgeId: 'BUL-301',
        department: 'Cyber Bullying',
        isVerified: true,
        kycStatus: 'verified'
    },
    {
        name: 'Phishing Attack Investigator',
        email: 'phishing@hypershield.net',
        password: 'password123',
        role: 'investigator',
        badgeId: 'PHI-401',
        department: 'Phishing Attack',
        isVerified: true,
        kycStatus: 'verified'
    },
    {
        name: 'Malware Specialist',
        email: 'malware@hypershield.net',
        password: 'password123',
        role: 'investigator',
        badgeId: 'MAL-501',
        department: 'Malware & Virus',
        isVerified: true,
        kycStatus: 'verified'
    },
    {
        name: 'Data Breach Investigator',
        email: 'databreach@hypershield.net',
        password: 'password123',
        role: 'investigator',
        badgeId: 'DBR-601',
        department: 'Data Breach',
        isVerified: true,
        kycStatus: 'verified'
    }
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        for (const account of officialAccounts) {
            const [user, created] = await User.findOrCreate({
                where: { email: account.email },
                defaults: account
            });

            if (!created) {
                console.log(`Updating existing account: ${account.email}`);
                await user.update(account);
            } else {
                console.log(`Created new account: ${account.email}`);
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
