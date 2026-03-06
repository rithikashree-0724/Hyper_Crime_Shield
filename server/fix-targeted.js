const { User } = require('./models');
const { sequelize } = require('./config/db');

async function fix() {
    try {
        console.log('--- TARGETED EMAIL FIX START ---');
        const user = await User.findByPk(10);
        if (user) {
            const original = user.email;
            const fixed = original.trim().toLowerCase();
            console.log(`User 10: Original="${original}" (len ${original.length}), Fixed="${fixed}" (len ${fixed.length})`);

            if (original !== fixed) {
                user.email = fixed;
                await user.save({ hooks: false });
                console.log('Update successful.');
            } else {
                console.log('No change needed for User 10.');
            }
        } else {
            console.log('User 10 not found.');
            // Search by partial match
            const { Op } = require('sequelize');
            const match = await User.findOne({ where: { email: { [Op.like]: 'rithikashreerithikashree5%' } } });
            if (match) {
                console.log(`Found similar user: ID=${match.id}, Email="${match.email}"`);
            }
        }

        // List all users one last time
        const all = await User.findAll();
        all.forEach(u => console.log(`ID: ${u.id}, Email: "${u.email}" (len ${u.email.length})`));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

fix();
