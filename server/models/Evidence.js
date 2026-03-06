const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Report = require('./Report');

const Evidence = sequelize.define('Evidence', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Report,
            key: 'id'
        }
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.STRING
    },
    fileSize: {
        type: DataTypes.INTEGER
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploadedById: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    chainOfCustody: {
        type: DataTypes.JSON, // Array of { action, actorId, timestamp }
        defaultValue: []
    }
}, {
    tableName: 'evidence',
    timestamps: true
});

module.exports = Evidence;
