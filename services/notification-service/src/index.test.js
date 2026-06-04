const request = require('supertest');
const app = require('./app');

// Mock the database pool
jest.mock('./config/db', () => {
    const mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params = []) => {
        if (query.includes('INSERT INTO notifications')) {
            return Promise.resolve({
                rows: [{
                    id: 'mock-notification-id',
                    type: params[0],
                    recipient: params[1],
                    subject: params[2] || null,
                    message: params[3],
                    status: params[4],
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('SELECT id, type, recipient')) {
            if (query.includes('WHERE id = $1') && params[0] === 'missing_id') {
                return Promise.resolve({ rows: [] });
            }
            if (query.includes('WHERE id = $1')) {
                return Promise.resolve({
                    rows: [{
                        id: params[0],
                        type: 'sms',
                        recipient: '+237600000002',
                        subject: null,
                        message: 'History lookup test',
                        status: 'sent',
                        created_at: new Date().toISOString()
                    }]
                });
            }
            return Promise.resolve({
                rows: [{
                    id: 'mock-notification-id',
                    type: 'sms',
                    recipient: '+237600000000',
                    subject: null,
                    message: 'Blood request nearby',
                    status: 'sent',
                    created_at: new Date().toISOString()
                }]
            });
        }
        return Promise.resolve({ rows: [] });
    });

    return { query: mockQuery, end: jest.fn() };
});

// Mock RabbitMQ
jest.mock('./config/rabbitmq', () => {
    return {
        connectRabbitMQ: jest.fn().mockResolvedValue(undefined),
        getChannel: jest.fn().mockReturnValue({
            consume: jest.fn(),
            close: jest.fn()
        })
    };
});

describe('Notification Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'notification-service' });
    });

    test('POST /notify/donor should queue donor notification', async () => {
        const response = await request(app)
            .post('/notify/donor')
            .send({ donorId: 'donor_1', phone: '+237600000000', message: 'Blood request nearby' });

        expect(response.statusCode).toBe(202);
        expect(response.body.message).toBe('SMS notification queued');
        expect(response.body.notification.type).toBe('sms');
        expect(response.body.notification.recipient).toBe('+237600000000');
    });

    test('POST /notify/hospital should queue hospital notification', async () => {
        const response = await request(app)
            .post('/notify/hospital')
            .send({
                hospitalId: 'hospital_1',
                email: 'bloodbank@example.com',
                subject: 'Donor matched',
                message: 'A donor accepted your request'
            });

        expect(response.statusCode).toBe(202);
        expect(response.body.message).toBe('Email notification queued');
        expect(response.body.notification.type).toBe('email');
        expect(response.body.notification.recipient).toBe('bloodbank@example.com');
    });

    test('GET /notify/history should return notification history', async () => {
        const response = await request(app).get('/notify/history');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.notifications)).toBe(true);
    });

    test('GET /notify/history/:id should return a notification by id', async () => {
        const response = await request(app).get('/notify/history/mock-notification-id');
        expect(response.statusCode).toBe(200);
        expect(response.body.notification.id).toBe('mock-notification-id');
    });

    test('GET /notify/history/:id should return 404 for missing notification', async () => {
        const response = await request(app).get('/notify/history/missing_id');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Notification not found');
    });

    test('notification endpoints should validate request bodies', async () => {
        const response = await request(app).post('/notify/donor').send({ donorId: 'donor_1' });
        expect(response.statusCode).toBe(400);
    });
});
