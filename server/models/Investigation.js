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
    },
    // New Workflow Fields
    complaintReviewStatus: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },
    forensicStatus: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },
    transactionStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'verified', 'suspicious'),
        defaultValue: 'pending'
    },
    callAnalysisStatus: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },
    physicalVerificationStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'verified'),
        defaultValue: 'pending'
    },
    forensicReport: {
        type: DataTypes.JSON, // { evidenceType, ipAddress, deviceInfo, details }
        allowNull: true
    },
    transactionReport: {
        type: DataTypes.JSON, // { accountNumber, transactionId, amount, bankName, date, status }
        allowNull: true
    },
    callAnalysisReport: {
        type: DataTypes.JSON, // { callerNumber, duration, date, location, details }
        allowNull: true
    },
    physicalVerificationReport: {
        type: DataTypes.JSON, // { locationVisit, witnessStatements, suspectId, details }
        allowNull: true
    },
    evidenceSummary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    finalReport: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resolvedDate: {
        type: DataTypes.DATE,
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
