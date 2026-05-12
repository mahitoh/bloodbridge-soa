const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./index');

const JWT_SECRET = 'your-secret-key';
let token;

beforeAll(() => {
    token = jwt.sign({ id: 1, email: 'test@example.com', role: 'donor' }, JWT_SECRET);
});

describe('Location Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'location-service' });
    });

    test('POST /location/nearby should find nearby donors', async () => {
        const response = await request(app)
            .post('/location/nearby')
            .set('Authorization', `Bearer ${token}`)
            .send({ lat: 3.84, lng: 11.5, bloodType: 'O+', radius: 10 });
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /location/distance should calculate distance', async () => {
        const response = await request(app)
            .get('/location/distance')
            .set('Authorization', `Bearer ${token}`)
            .query({ lat1: 3.84, lng1: 11.5, lat2: 3.85, lng2: 11.51 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('distance');
    });

    test('POST /location/nearby should fail without params', async () => {
        const response = await request(app)
            .post('/location/nearby')
            .set('Authorization', `Bearer ${token}`)
            .send({});
        expect(response.statusCode).toBe(400);
    });
});
