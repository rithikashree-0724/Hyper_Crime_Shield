const { Notification, CaseHistory } = require('../models');
const logger = require('./logger');

/**
 * Creates a notification and logs case history for a report
 * @param {Object} params
 * @param {number} params.reportId - ID of the report
 * @param {number} params.userId - Recipient user ID (e.g., report owner)
 * @param {number} params.changedBy - User ID who made the change
 * @param {string} params.oldStatus - Previous status
 * @param {string} params.newStatus - New status
 * @param {string} params.message - Notification message
 * @param {string} [params.comment] - Optional comment for history
 */
async function trackStatusChange({ reportId, userId, changedBy, oldStatus, newStatus, message, comment }) {
    try {
        // 1. Create Notification for the user
        await Notification.create({
            userId,
            type: 'status_update',
            message,
            relatedId: reportId
        });

        // 2. Log to Case History
        await CaseHistory.create({
            reportId,
            changedBy,
            oldStatus,
            newStatus,
            comment: comment || `Status changed from ${oldStatus} to ${newStatus}`
        });

        logger.info(`Status change tracked for Report ${reportId}: ${oldStatus} -> ${newStatus}`);
    } catch (err) {
        logger.error(`Failed to track status change for Report ${reportId}: ${err.message}`);
    }
}

module.exports = { trackStatusChange };
