const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

function backupDatabase() {
    const dbPath = path.join(__dirname, '../database.sqlite');
    const backupDir = path.join(__dirname, '../backups');

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.sqlite`);

    try {
        if (fs.existsSync(dbPath)) {
            fs.copyFileSync(dbPath, backupPath);
            logger.info(`Database backup created: ${backupPath}`);
            console.log(`Backup successful: ${backupPath}`);
        } else {
            logger.warn('Database file not found for backup');
        }
    } catch (err) {
        logger.error(`Database backup failed: ${err.message}`);
        console.error('Backup failed:', err);
    }
}

// Ensure backups folder exists
if (require.main === module) {
    backupDatabase();
}

module.exports = backupDatabase;
