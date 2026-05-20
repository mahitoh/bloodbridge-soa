const request = require('supertest');
const app = require('./app');

describe('Notification Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'notification-service' });
    });

    test('POST /notify/donor should queue donor notification', async () => {
        const response = await request(app)
            .post('/notify/donor')
            .send({ donorId: 'donor_1', phone: '+254700000001', message: 'Blood request nearby' });

        expect(response.statusCode).toBe(202);
        expect(response.body.delivery.status).toBe('queued');
    });

    test('POST /notify/hospital should queue hospital notification', async () => {
        const response = await request(app)
            .post('/notify/hospital')
            .send({
                hospitalId: 'hospital_1',
                email: 'bloodbank@knh.example',
                subject: 'Donor matched',
                message: 'A donor accepted your request'
            });

        expect(response.statusCode).toBe(202);
        expect(response.body.delivery.status).toBe('queued');
        expect(response.body.delivery.provider).toBe('stub-email');
    });

    test('notification endpoints should validate request bodies', async () => {
        const response = await request(app).post('/notify/donor').send({ donorId: 'donor_1' });
        expect(response.statusCode).toBe(400);
    });
});
