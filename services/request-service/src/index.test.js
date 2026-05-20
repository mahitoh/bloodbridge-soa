const request = require('supertest');
const app = require('./app');

describe('Request Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'request-service' });
    });

    test('POST /requests should create request and update status', async () => {
        const createResponse = await request(app)
            .post('/requests')
            .send({ hospitalId: 'hospital_1', bloodType: 'B+', units: 3, urgency: 'CRITICAL', city: 'Nairobi' });

        expect(createResponse.statusCode).toBe(201);
        expect(createResponse.body.request.status).toBe('OPEN');

        const statusResponse = await request(app)
            .put(`/requests/${createResponse.body.request.id}/status`)
            .send({ status: 'FULFILLED' });

        expect(statusResponse.statusCode).toBe(200);
        expect(statusResponse.body.request.status).toBe('FULFILLED');
    });

    test('GET /requests should list and fetch requests', async () => {
        const listResponse = await request(app).get('/requests');
        expect(listResponse.statusCode).toBe(200);
        expect(listResponse.body.requests.length).toBeGreaterThan(0);

        const requestId = listResponse.body.requests[0].id;
        const getResponse = await request(app).get(`/requests/${requestId}`);
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.request.id).toBe(requestId);
    });

    test('request endpoints should handle validation and not found cases', async () => {
        const invalidResponse = await request(app).post('/requests').send({ hospitalId: 'hospital_1' });
        expect(invalidResponse.statusCode).toBe(400);

        const missingResponse = await request(app).get('/requests/missing');
        expect(missingResponse.statusCode).toBe(404);

        const missingStatusResponse = await request(app)
            .put('/requests/missing/status')
            .send({ status: 'CANCELLED' });
        expect(missingStatusResponse.statusCode).toBe(404);
    });
});
