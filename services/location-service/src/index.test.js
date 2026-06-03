const request = require('supertest');
const app = require('./app');

describe('Location Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'location-service' });
    });

    test('GET /metrics returns prometheus metrics', async () => {
        const response = await request(app).get('/metrics');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('http_requests_total');
        expect(response.text).toContain('http_response_time_seconds');
    });

    test('POST /location/nearby should return nearby donors', async () => {
        const response = await request(app)
            .post('/location/nearby')
            .send({ latitude: -1.2921, longitude: 36.8219, radiusKm: 10, bloodType: 'O+' });

        expect(response.statusCode).toBe(200);
        expect(response.body.donors.length).toBeGreaterThan(0);
    });

    test('POST /location/distance should calculate distance', async () => {
        const response = await request(app)
            .post('/location/distance')
            .send({
                from: { latitude: -1.2921, longitude: 36.8219 },
                to: { latitude: -1.3008, longitude: 36.8073 }
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.distanceKm).toBeGreaterThan(0);
    });

    test('location endpoints should validate request bodies', async () => {
        const response = await request(app).post('/location/nearby').send({ latitude: -1.2921 });
        expect(response.statusCode).toBe(400);
    });
});
