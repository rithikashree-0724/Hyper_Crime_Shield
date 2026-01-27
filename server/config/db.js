const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure env vars are loaded

// Connect to MySQL database
// Database: 'hyper_crime_shield', User: 'root', Password: 'root'
// If database doesn't exist, we might need to create it manually or via script.
// For now, assume 'hyper_crime_shield' exists or we can create it.
// Actually, let's try to connect to 'mysql' first to create the DB if needed, or just specific DB.

const sequelize = new Sequelize('hyper_crime_shield', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database Connected Successfully.');
        // Sync models
        await sequelize.sync({ alter: true }); // Updates schema without dropping data if possible
        console.log('Database Synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        // Fallback: If DB doesn't exist, try connecting to root and creating it?
        // Users usually create DB manually. I'll ask user if this fails.
    }
};

module.exports = { sequelize, connectDB };
