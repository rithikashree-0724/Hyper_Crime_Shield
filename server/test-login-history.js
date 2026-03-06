const User = require('./models/User');
const { sequelize } = require('./config/db');

async function testHistory() {
    try {
        console.log('--- LOGIN HISTORY PERSISTENCE TEST ---');
        const user = await User.findOne({ where: { email: 'rithikashreerithikashree5@gmail.com' } });

        if (!user) {
            console.log('User not found. Please register or change the email in script.');
            return;
        }

        console.log('Current History:', JSON.stringify(user.loginHistory, null, 2));

        const history = user.loginHistory || [];
        history.push({ ip: '1.2.3.4', device: 'TEST-SCRIPT', date: new Date() });

        user.loginHistory = [...history];
        user.changed('loginHistory', true);

        console.log('Saving user with new history...');
        await user.save();
        console.log('User saved.');

        const updatedUser = await User.findByPk(user.id);
        console.log('Updated History in DB:', JSON.stringify(updatedUser.loginHistory, null, 2));

        if (updatedUser.loginHistory && updatedUser.loginHistory.length > (user.loginHistory ? user.loginHistory.length - 1 : 0)) {
            console.log('SUCCESS: History persisted!');
        } else {
            console.log('FAILURE: History NOT persisted!');
        }

    } catch (err) {
        console.error('Error during test:', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

testHistory();
