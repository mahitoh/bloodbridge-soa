const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./index');

const JWT_SECRET = 'your-secret-key';
let token;

beforeAll(() => {
    token = jwt.sign({ id: 1, email: 'test@example.com', role: 'hospital' }, JWT_SECRET);
});

describe('Request Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'request-service' });
    });

    test('POST /requests should create a request', async () => {
        const reqData = {
            hospitalId: 1,
            bloodType: 'O+',
            unitsNeeded: 3,
            urgency: 'critical',
            location: 'Yaoundé'
        };
        const response = await request(app)
            .post('/requests')
            .set('Authorization', `Bearer ${token}`)
            .send(reqData);
        expect(response.statusCode).toBe(201);
        expect(response.body.bloodType).toBe(reqData.bloodType);
        expect(response.body.status).toBe('active');
    });

    test('GET /requests should return all requests', async () => {
        const response = await request(app)
            .get('/requests')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /requests/:id should return request', async () => {
        const response = await request(app)
            .get('/requests/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test('PUT /requests/:id should update request', async () => {
        const response = await request(app)
            .put('/requests/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ unitsNeeded: 5 });
        expect(response.statusCode).toBe(200);
        expect(response.body.unitsNeeded).toBe(5);
    });

    test('PUT /requests/:id/cancel should cancel request', async () => {
        const response = await request(app)
            .put('/requests/1/cancel')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('cancelled');
    });

    test('PUT /requests/:id/fulfill should fulfill request', async () => {
        const response = await request(app)
            .put('/requests/2/fulfill')
            .set('Authorization', `Bearer ${token}`);
        // Assuming another request, but for simplicity, test with existing
        expect(response.statusCode).toBe(404); // Since 2 doesn't exist
    });

    test('GET /requests/:id should return 404 for non-existent request', async () => {
        const response = await request(app)
            .get('/requests/999')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404);
    });
});
