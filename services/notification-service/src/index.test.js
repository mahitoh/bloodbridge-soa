const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./index');

const JWT_SECRET = 'your-secret-key';
let token;

beforeAll(() => {
    token = jwt.sign({ id: 1, email: 'test@example.com', role: 'donor' }, JWT_SECRET);
});

describe('Notification Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'notification-service' });
    });

    test('POST /notifications should send a notification', async () => {
        const notifData = {
            recipientId: 1,
            message: 'Blood request nearby',
            type: 'alert'
        };
        const response = await request(app)
            .post('/notifications')
            .set('Authorization', `Bearer ${token}`)
            .send(notifData);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Notification sent');
    });

    test('GET /notifications/:userId should return notifications', async () => {
        const response = await request(app)
            .get('/notifications/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('PUT /notifications/:id/read should mark as read', async () => {
        const response = await request(app)
            .put('/notifications/1/read')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.read).toBe(true);
    });

    test('PUT /notifications/:id/read should return 404 for non-existent', async () => {
        const response = await request(app)
            .put('/notifications/999/read')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404);
    });
});
