const { User } = require('./models');
const { sequelize } = require('./config/db');

async function checkUser() {
    try {
        const target = 'rithikashreerithikashree5@gmail.com';
        console.log(`Checking for user: "${target}" (Length: ${target.length})`);

        const user = await User.findOne({ where: { email: target } });
        if (user) {
            console.log('User found!');
        } else {
            console.log('User NOT found with exact match.');
            const allUsers = await User.findAll({ attributes: ['id', 'email'] });
            console.log('All user emails in DB:');
            allUsers.forEach(u => {
                let ascii = '';
                for (let i = 0; i < u.email.length; i++) ascii += u.email.charCodeAt(i) + ' ';
                console.log(`- ID: ${u.id} Email: "${u.email}" (Length: ${u.email.length}) ASCII: ${ascii}`);
                if (u.email.trim() === target.trim()) {
                    console.log('   >>> MATCH FOUND AFTER TRIM! <<<');
                }
            });
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

checkUser();
