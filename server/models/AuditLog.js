const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'LOGIN', 'REPORT_CREATED', 'STATUS_UPDATED'
    },
    resource: {
        type: DataTypes.STRING,
        allowNull: true // e.g., 'Report', 'User'
    },
    resourceId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false // Audit logs are immutable
});

module.exports = AuditLog;
