const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Report = require('./Report');

const Investigation = sequelize.define('Investigation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Report,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'suspended', 'closed'),
        defaultValue: 'active'
    },
    investigatorIds: {
        type: DataTypes.JSON, // Array of User IDs
        defaultValue: []
    },
    primaryInvestigatorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    notes: {
        type: DataTypes.JSON, // Array of { content, authorId, date }
        defaultValue: []
    },
    tasks: {
        type: DataTypes.JSON, // Array of { title, isCompleted, assignedTo }
        defaultValue: []
    },
    outcome: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'investigations',
    timestamps: true,
    indexes: [
        { fields: ['status'] }
    ]
});

module.exports = Investigation;
