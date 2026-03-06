const { User } = require('./models');
const { sequelize } = require('./config/db');

async function verify() {
    try {
        console.log('--- DB VERIFICATION ---');
        const users = await User.findAll();
        console.log(`Total Users: ${users.length}`);
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, Verified: ${u.isVerified}, Hash: ${u.password.substring(0, 30)}...`);
        });
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
}
verify();
