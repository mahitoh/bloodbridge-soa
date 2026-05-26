const Notification = require('../models/notification.model');
const notificationRepository = require('../repositories/notification.repository');
const { sendSMS } = require('../providers/sms.provider');
const { sendEmail } = require('../providers/email.provider');
const { toNotificationResponse } = require('../dtos/notification.dto');

const sendSmsNotification = async ({ phone, message, donorId = null }) => {
    const delivery = await sendSMS({ phone, message });

    const notification = new Notification({
        type: 'sms',
        recipient: phone,
        message,
        status: delivery.status,
        providerResponse: delivery,
        metadata: donorId ? { donorId } : {}
    });

    return toNotificationResponse(notificationRepository.create(notification));
};

const sendEmailNotification = async ({ email, subject, message, hospitalId = null }) => {
    const delivery = await sendEmail({ email, subject, message });

    const notification = new Notification({
        type: 'email',
        recipient: email,
        subject,
        message,
        status: delivery.status,
        providerResponse: delivery,
        metadata: hospitalId ? { hospitalId } : {}
    });

    return toNotificationResponse(notificationRepository.create(notification));
};

const getNotificationHistory = () => {
    return notificationRepository.findAll().map(toNotificationResponse);
};

const getNotificationById = (id) => {
    const notification = notificationRepository.findById(id);

    if (!notification) {
        const error = new Error('Notification not found');
        error.status = 404;
        throw error;
    }

    return toNotificationResponse(notification);
};

module.exports = {
    sendSmsNotification,
    sendEmailNotification,
    getNotificationHistory,
    getNotificationById
};