const notificationService = require('../services/notification.service');
const { successResponse } = require('../utils/apiResponse');
const { notificationsSent } = require('../metrics');

const sendSmsNotification = async (req, res, next) => {
    try {
        const notification = await notificationService.sendSmsNotification(req.body);
        notificationsSent.inc({ type: 'sms', service: 'notification-service' });
        return successResponse(res, 202, 'SMS notification queued', notification);
    } catch (error) {
        next(error);
    }
};

const sendEmailNotification = async (req, res, next) => {
    try {
        const notification = await notificationService.sendEmailNotification(req.body);
        notificationsSent.inc({ type: 'email', service: 'notification-service' });
        return successResponse(res, 202, 'Email notification queued', notification);
    } catch (error) {
        next(error);
    }
};

const getNotificationHistory = async (req, res, next) => {
    try {
        const notifications = notificationService.getNotificationHistory();
        return successResponse(res, 200, 'Notification history retrieved', notifications);
    } catch (error) {
        next(error);
    }
};

const getNotificationById = async (req, res, next) => {
    try {
        const notification = notificationService.getNotificationById(req.params.id);
        return successResponse(res, 200, 'Notification retrieved', notification);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendSmsNotification,
    sendEmailNotification,
    getNotificationHistory,
    getNotificationById
};
