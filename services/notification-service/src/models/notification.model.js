class Notification {
    constructor({ type, recipient, subject = null, message, status, providerResponse, metadata = {} }) {
        this.id = `notification_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.type = type;
        this.recipient = recipient;
        this.subject = subject;
        this.message = message;
        this.status = status;
        this.providerResponse = providerResponse;
        this.metadata = metadata;
        this.createdAt = new Date().toISOString();
    }
}

module.exports = Notification;