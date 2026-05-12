require('dotenv').config({ path: '../../.env' }); // Adjust path as needed

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const notifications = []; // In-memory storage for demo
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'notification-service' });
});

// Send notification
app.post('/notifications', authenticate, (req, res) => {
    const { recipientId, message, type } = req.body;
    if (!recipientId || !message || !type) {
        return res.status(400).json({ error: 'Recipient ID, message, and type are required' });
    }
    const notification = {
        id: notifications.length + 1,
        recipientId,
        message,
        type,
        sentAt: new Date(),
        read: false
    };
    notifications.push(notification);
    // In real, send email/SMS
    res.status(201).json({ message: 'Notification sent', notification });
});

// Get notifications for user
app.get('/notifications/:userId', authenticate, (req, res) => {
    const userNotifications = notifications.filter(n => n.recipientId == req.params.userId);
    res.json(userNotifications);
});

// Mark as read
app.put('/notifications/:id/read', authenticate, (req, res) => {
    const notification = notifications.find(n => n.id == req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    notification.read = true;
    res.json(notification);
});

const PORT = process.env.PORT || 30006;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
}
module.exports = app;
