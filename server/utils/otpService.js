const crypto = require('crypto');

/**
 * Generates a 6-digit numeric OTP
 */
exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Mock email sender for development
 */
exports.sendMockEmail = (to, otp) => {
    console.log('-----------------------------------------');
    console.log(`[MOCK EMAIL SERVICE]`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: Security Verification Code`);
    console.log(`BODY: Your OTP is ${otp}`);
    console.log('-----------------------------------------');
    return true;
};
