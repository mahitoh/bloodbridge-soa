const pool = require('../config/db');
const { getChannel } = require('../config/rabbitmq');
const { updateRequestMetrics } = require('../metrics');

const listRequests = async (req, res, next) => {
    try {
        const { status, blood_type } = req.query;
        let query = 'SELECT id, hospital_id, blood_type, units, urgency, radius, notes, status, created_at FROM requests WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (status) {
            query += ` AND status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }
        if (blood_type) {
            query += ` AND blood_type = $${paramCount}`;
            params.push(blood_type);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        updateRequestMetrics(result.rows);
        res.json({ requests: result.rows });
    } catch (error) {
        next(error);
    }
};

const getRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, hospital_id, blood_type, units, urgency, radius, notes, status, created_at FROM requests WHERE id = $1', 
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blood request not found' });
        }

        res.json({ request: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

const createRequest = async (req, res, next) => {
    try {
        const { hospital_id, blood_type, units, urgency, radius, notes, status } = req.body;
        
        const result = await pool.query(
            `INSERT INTO requests (hospital_id, blood_type, units, urgency, radius, notes, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, hospital_id, blood_type, units, urgency, radius, notes, status, created_at`,
            [hospital_id, blood_type, units, urgency, radius, notes, status || 'Active']
        );

        const request = result.rows[0];
        
        // Publish to RabbitMQ for notification service
        const channel = getChannel();
        if (channel) {
            const message = {
                requestId: request.id,
                bloodType: request.blood_type,
                urgency: request.urgency,
                radius: request.radius,
                notes: request.notes,
                timestamp: new Date().toISOString()
            };
            
            channel.sendToQueue('blood_requests', Buffer.from(JSON.stringify(message)), { persistent: true });
            console.log('📤 Published request to RabbitMQ queue');
        } else {
            console.warn('⚠️ RabbitMQ channel not available, request created but not queued');
        }

        updateRequestMetrics([request]);
        res.status(201).json({ message: 'Blood request created', request });
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            'UPDATE requests SET status = $1 WHERE id = $2 RETURNING id, hospital_id, blood_type, units, urgency, radius, notes, status, created_at',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blood request not found' });
        }

        res.json({ message: 'Request status updated', request: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = { listRequests, getRequest, createRequest, updateStatus };
