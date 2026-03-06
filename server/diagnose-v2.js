const { User } = require('./models');
const { sequelize } = require('./config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function diagnose() {
    try {
        console.log('--- DIAGNOSTIC START ---');
        console.log(`MAIL_USER: ${process.env.MAIL_USER}`);

        // 1. Check User (from user's screenshot)
        const email = 'rithikashreerithikashree5@gmail.com';
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`[USER FOUND] Name: ${user.name}, Verified: ${user.isVerified}`);
        } else {
            console.log(`[USER NOT FOUND] ${email}`);
        }

        // 2. Test SMTP Connection (SSL - 465)
        console.log('Testing SSL (Port 465)...');
        const transporter465 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
            connectionTimeout: 10000 // 10s
        });

        try {
            await transporter465.verify();
            console.log('[SMTP SUCCESS] SSL Port 465 verified.');
        } catch (e465) {
            console.error('[SMTP FAILED] SSL Port 465:', e465.message);
        }

        // 3. Test SMTP Connection (STARTTLS - 587)
        console.log('Testing STARTTLS (Port 587)...');
        const transporter587 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
            connectionTimeout: 10000 // 10s
        });

        try {
            await transporter587.verify();
            console.log('[SMTP SUCCESS] STARTTLS Port 587 verified.');
        } catch (e587) {
            console.error('[SMTP FAILED] STARTTLS Port 587:', e587.message);
        }

    } catch (err) {
        console.error('[DIAGNOSTIC ERROR]', err);
    } finally {
        if (sequelize) await sequelize.close();
        process.exit();
    }
}

diagnose();
