const { sequelize } = require('./config/db');
const { User, Report, Investigation, Evidence, Message, AuditLog, Notification, CaseHistory } = require('./models');

async function syncDB() {
    try {
        console.log('Syncing database with alter: true...');
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully!');
    } catch (err) {
        console.error('Error syncing database:', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

syncDB();
