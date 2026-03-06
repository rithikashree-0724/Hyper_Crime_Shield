const { User } = require('./models');
const { sequelize } = require('./config/db');
const fs = require('fs');

async function verify() {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email: 'aravind@gmail.com' } });
        if (user) {
            fs.writeFileSync('final_check.txt', `Citizen Found: ${user.email} | Role: ${user.role}`);
        } else {
            const count = await User.count();
            fs.writeFileSync('final_check.txt', `Citizen NOT Found. Total users: ${count}`);
        }
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('final_check.txt', `Error: ${err.message}`);
        process.exit(1);
    }
}
verify();
