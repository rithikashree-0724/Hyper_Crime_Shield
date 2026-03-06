const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('[EMAIL ERROR] Connection failed:', error.message);
    } else {
        console.log('[EMAIL SUCCESS] Server is ready to take our messages');
    }
});

/**
 * Send Email Notification Service
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            console.warn('[EMAIL WARNING] Mail credentials missing. Falling back to mock.');
            console.log(`[MOCK EMAIL] TO: ${to}`);
            return { messageId: 'mock-id' };
        }

        const mailOptions = {
            from: `"Hyper Crime Shield" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Message sent to ${to}: %s`, info.messageId);
        return info;
    } catch (error) {
        console.error('[EMAIL ERROR] Detailed Error:', error);
        throw new Error(`Email delivery failed: ${error.message}`);
    }
};

const templates = {
    statusUpdate: (report) => ({
        subject: `[Update] Report #${report.complaintId} Status Changed`,
        text: `Your report status has been updated to ${report.status}.`,
        html: `<h3>Status Update</h3><p>Your report <b>#${report.complaintId}</b> has been moved to <b>${report.status}</b>.</p>`
    }),
    securityAlert: (user, action) => ({
        subject: `Security Alert: ${action}`,
        text: `A sensitive action (${action}) was performed on your account.`,
        html: `<p>Security Alert: <b>${action}</b> detected on your account.</p>`
    }),
    otpEntry: (otp) => ({
        subject: 'Security Verification Code',
        text: `Your One-Time Password (OTP) is: ${otp}. This code is valid for 10 minutes.`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #137fec;">Security Verification</h2>
                <p>You are receiving this email because a security verification code was requested for your HyperShield account.</p>
                <div style="background: #f4f7fa; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #101922;">${otp}</span>
                </div>
                <p style="color: #666; font-size: 12px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `
    }),
    emailVerification: (email, token) => ({
        subject: 'Verify Your HyperShield Account',
        text: `Welcome to Hyper Crime Shield! Please verify your email by clicking: http://localhost:5173/verify?token=${token}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: auto; background-color: #ffffff; color: #333;">
                <h2 style="color: #137fec; text-align: center;">Welcome to HyperShield</h2>
                <p>Thank you for joining the Hyper Crime Shield network. To activate your account and gain full access to our security features, please verify your email address.</p>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="http://localhost:5173/verify?token=${token}" style="background-color: #137fec; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Verify Email Address</a>
                </div>
                <p>If the button above does not work, please copy and paste the following link into your browser:</p>
                <p style="word-break: break-all; color: #137fec;">http://localhost:5173/verify?token=${token}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #888; font-size: 12px; text-align: center;">This is an automated security message. Please do not reply to this email.</p>
            </div>
        `
    })
};

module.exports = { sendEmail, templates };
