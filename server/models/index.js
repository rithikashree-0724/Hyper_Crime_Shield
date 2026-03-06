const User = require('./User');
const Report = require('./Report');
const Investigation = require('./Investigation');
const Evidence = require('./Evidence');
const Message = require('./Message');
const AuditLog = require('./AuditLog');
const Notification = require('./Notification');
const CaseHistory = require('./CaseHistory');

// Associations
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Report.hasOne(Investigation, { foreignKey: 'reportId', as: 'investigation' });
Investigation.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });
Investigation.belongsTo(User, { foreignKey: 'primaryInvestigatorId', as: 'primaryInvestigator' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Report.hasMany(CaseHistory, { foreignKey: 'reportId', as: 'history' });
CaseHistory.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });

// Evidence & Messages
Report.hasMany(Evidence, { foreignKey: 'reportId', as: 'allEvidence' });
Evidence.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });
User.hasMany(Evidence, { foreignKey: 'uploadedById', as: 'uploadedEvidence' });
Evidence.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploader' });

Report.hasMany(Message, { foreignKey: 'reportId', as: 'messages' });
Message.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// Audit Logs
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    User,
    Report,
    Investigation,
    Evidence,
    Message,
    AuditLog,
    Notification,
    CaseHistory
};
