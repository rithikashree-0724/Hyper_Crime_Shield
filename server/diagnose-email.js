const { User } = require('./models');
const { sequelize } = require('./config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function diagnose() {
    try {
        console.log('--- DIAGNOSTIC START ---');
        console.log(`MAIL_USER: ${process.env.MAIL_USER}`);
        console.log(`MAIL_PASS (masked): ${process.env.MAIL_PASS ? '********' : 'MISSING'}`);

        // 1. Check User
        const email = 'rithikashreerithikashree5@gmail.com';
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`[USER FOUND] Name: ${user.name}, Verified: ${user.isVerified}`);
        } else {
            console.log(`[USER NOT FOUND] ${email}`);
        }

        // 2. Test SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log('Verifying SMTP connection...');
        await transporter.verify();
        console.log('[SMTP SUCCESS] Connection verified.');

    } catch (err) {
        console.error('[DIAGNOSTIC ERROR]', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

diagnose();
