const pool = require('../config/db');

const sendSmsNotification = async (req, res, next) => {
    try {
        const { phone, message, donorId } = req.body;
        
        // In a real app, this would call Twilio/Africa's Talking
        const mockDelivery = { status: 'sent', providerId: 'mock-sms-123' };

        const result = await pool.query(
            `INSERT INTO notifications (type, recipient, message, status, provider_response, metadata) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, type, recipient, message, status, created_at`,
            ['sms', phone, message, mockDelivery.status, JSON.stringify(mockDelivery), JSON.stringify({ donorId })]
        );

        res.status(202).json({ message: 'SMS notification queued', notification: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

const sendEmailNotification = async (req, res, next) => {
    try {
        const { email, subject, message, hospitalId } = req.body;
        
        const mockDelivery = { status: 'sent', providerId: 'mock-email-123' };

        const result = await pool.query(
            `INSERT INTO notifications (type, recipient, subject, message, status, provider_response, metadata) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, type, recipient, subject, message, status, created_at`,
            ['email', email, subject, message, mockDelivery.status, JSON.stringify(mockDelivery), JSON.stringify({ hospitalId })]
        );

        res.status(202).json({ message: 'Email notification queued', notification: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

const getNotificationHistory = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT id, type, recipient, subject, message, status, created_at FROM notifications ORDER BY created_at DESC'
        );
        res.json({ notifications: result.rows });
    } catch (error) {
        next(error);
    }
};

const getNotificationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, type, recipient, subject, message, status, created_at FROM notifications WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ notification: result.rows[0] });
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
