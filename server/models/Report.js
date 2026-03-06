const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Import User for referencing

// Define the Report model
const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Use the model itself
            key: 'id'
        }
    },
    complaintId: { // Custom ID like CRIME-2024-001
        type: DataTypes.STRING,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium'
    },
    status: {
        type: DataTypes.ENUM('pending', 'review', 'approved', 'investigating', 'resolved', 'closed', 'escalated'),
        defaultValue: 'pending'
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    suspects: {
        type: DataTypes.TEXT, // Stored as string
        allowNull: true
    },
    evidence: {
        type: DataTypes.JSON, // To store file paths
        allowNull: true
    },
    incidentDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'reports',
    timestamps: true,
    paranoid: true, // Enable soft deletes
    indexes: [
        { fields: ['complaintId'] },
        { fields: ['status'] },
        { fields: ['category'] }
    ]
});

module.exports = Report;
