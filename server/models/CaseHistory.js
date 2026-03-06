const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CaseHistory = sequelize.define('CaseHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    reportId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    changedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    oldStatus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    newStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'case_history',
    timestamps: true
});

module.exports = CaseHistory;
