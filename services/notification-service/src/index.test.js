const request = require('supertest');
const app = require('./app');

describe('Notification Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'notification-service' });
    });

    test('GET /metrics returns prometheus metrics', async () => {
        const response = await request(app).get('/metrics');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('http_requests_total');
        expect(response.text).toContain('bloodbridge_notifications_sent_total');
    });

    test('POST /notify/donor should queue donor notification', async () => {
        const response = await request(app)
            .post('/notify/donor')
            .send({ donorId: 'donor_1', phone: '+237600000000', message: 'Blood request nearby' });

        expect(response.statusCode).toBe(202);
        expect(response.body.success).toBe(true);
        expect(response.body.data.type).toBe('sms');
        expect(response.body.data.metadata.donorId).toBe('donor_1');
        expect(response.body.data.providerResponse.status).toBe('queued');
        expect(response.body.data.providerResponse.provider).toBe('stub-sms');
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
        expect(response.body.success).toBe(true);
        expect(response.body.data.type).toBe('email');
        expect(response.body.data.metadata.hospitalId).toBe('hospital_1');
        expect(response.body.data.providerResponse.status).toBe('queued');
        expect(response.body.data.providerResponse.provider).toBe('stub-email');
    });

    test('POST /notify/sms should queue SMS notification', async () => {
        const response = await request(app)
            .post('/notify/sms')
            .send({ phone: '+237600000001', message: 'BloodBridge SMS test' });

        expect(response.statusCode).toBe(202);
        expect(response.body.success).toBe(true);
        expect(response.body.data.type).toBe('sms');
        expect(response.body.data.recipient).toBe('+237600000001');
    });

    test('POST /notify/email should queue email notification', async () => {
        const response = await request(app)
            .post('/notify/email')
            .send({
                email: 'recipient@example.com',
                subject: 'BloodBridge Email Test',
                message: 'BloodBridge email test'
            });

        expect(response.statusCode).toBe(202);
        expect(response.body.success).toBe(true);
        expect(response.body.data.type).toBe('email');
        expect(response.body.data.recipient).toBe('recipient@example.com');
    });

    test('GET /notify/history should return notification history', async () => {
        const response = await request(app).get('/notify/history');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /notify/history/:id should return a notification by id', async () => {
        const createResponse = await request(app)
            .post('/notify/sms')
            .send({ phone: '+237600000002', message: 'History lookup test' });

        const response = await request(app).get(`/notify/history/${createResponse.body.data.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(createResponse.body.data.id);
    });

    test('GET /notify/history/:id should return 404 for missing notification', async () => {
        const response = await request(app).get('/notify/history/missing_id');

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test('notification endpoints should validate request bodies', async () => {
        const response = await request(app).post('/notify/donor').send({ donorId: 'donor_1' });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
});
