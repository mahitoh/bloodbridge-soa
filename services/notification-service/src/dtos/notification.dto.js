const toNotificationResponse = (notification) => ({
    id: notification.id,
    type: notification.type,
    recipient: notification.recipient,
    subject: notification.subject,
    message: notification.message,
    status: notification.status,
    providerResponse: notification.providerResponse,
    metadata: notification.metadata,
    createdAt: notification.createdAt
});

module.exports = { toNotificationResponse };