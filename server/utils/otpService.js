const crypto = require('crypto');

/**
 * Generates a 6-digit numeric OTP
 */
exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Mock function to send email
 * In production, this would use nodemailer or a service like SendGrid
 */
exports.sendMockEmail = (email, otp) => {
    const timestamp = new Date().toLocaleString();
    const logMessage = `
┌──────────────────────────────────────────────────┐
│ [EMAIL SERVICE] - ${timestamp}
├──────────────────────────────────────────────────┤
│ To: ${email}
│ Subject: Security Verification Code
│ 
│ Hello,
│ 
│ You are receiving this email because you (or someone
│ acting as you) requested a security verification 
│ code for your HyperShield account.
│ 
│ Your One-Time Password (OTP) is:
│ 
│              >  ${otp}  <
│ 
│ This code is valid for 10 minutes.
│ If you did not request this, please ignore this.
└──────────────────────────────────────────────────┘
`;
    console.log(logMessage);
    return true;
};
