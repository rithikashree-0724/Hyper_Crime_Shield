const { User } = require('./models');
const { sequelize } = require('./config/db');

async function cleanup() {
    try {
        console.log('--- EMAIL CLEANUP START ---');
        const users = await User.findAll();
        let count = 0;

        for (const user of users) {
            const originalEmail = user.email;
            const trimmedEmail = originalEmail.trim().toLowerCase();

            if (originalEmail !== trimmedEmail) {
                console.log(`Fixing User ID ${user.id}: "${originalEmail}" -> "${trimmedEmail}"`);
                user.email = trimmedEmail;
                await user.save({ hooks: false });
                count++;
            }
        }

        console.log(`[SUCCESS] Email cleanup complete. Fixed ${count} users.`);
    } catch (err) {
        console.error('[CLEANUP ERROR]', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

cleanup();
