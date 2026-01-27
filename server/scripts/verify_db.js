const { sequelize } = require('../config/db');
const User = require('../models/User');

const verify = async () => {
    try {
        console.log('Attempting to connect to database...');
        await sequelize.authenticate();
        console.log('Connection successful.');

        console.log('Syncing tables...');
        await sequelize.sync({ alter: true });
        console.log('Tables synced.');

        console.log('Checking for Users...');
        const count = await User.count();
        console.log(`Current user count: ${count}`);

        console.log('Diagnostic passed.');
        process.exit(0);
    } catch (error) {
        console.error('Diagnostic failed:', error);
        process.exit(1);
    }
};

verify();
