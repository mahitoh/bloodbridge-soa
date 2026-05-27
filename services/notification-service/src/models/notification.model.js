const createNotification = ({ type, recipient, subject = null, message, status, providerResponse, metadata = {} }) => ({
    id: `notification_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    recipient,
    subject,
    message,
    status,
    providerResponse,
    metadata,
    createdAt: new Date().toISOString()
});

module.exports = { createNotification };