const User = require('./User');
const Report = require('./Report');
const Investigation = require('./Investigation');
const Evidence = require('./Evidence');
const Message = require('./Message');

// Associations are already defined in the files, but importing them here
// ensures they are all registered with the Sequelize instance properly.

module.exports = {
    User,
    Report,
    Investigation,
    Evidence,
    Message
};
