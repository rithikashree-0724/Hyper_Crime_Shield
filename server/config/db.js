const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for zero-configuration setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: (msg) => console.log(`[SEQUELIZE] ${msg}`)
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite Database Connected Successfully.');

        await sequelize.sync({ alter: true });
        console.log('Database Synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
