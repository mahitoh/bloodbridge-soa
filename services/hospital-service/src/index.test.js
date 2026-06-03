const request = require('supertest');
const app = require('./app');

describe('Hospital Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'hospital-service' });
    });

    test('GET /metrics returns prometheus metrics', async () => {
        const response = await request(app).get('/metrics');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('http_requests_total');
        expect(response.text).toContain('http_response_time_seconds');
    });

    test('POST /hospitals should create hospital', async () => {
        const response = await request(app)
            .post('/hospitals')
            .send({ name: 'City Hospital', email: 'city@example.com', phone: '+254700000004', city: 'Nakuru', address: 'Main Street' });

        expect(response.statusCode).toBe(201);
        expect(response.body.hospital.name).toBe('City Hospital');
    });

    test('GET /hospitals should list and fetch hospitals', async () => {
        const listResponse = await request(app).get('/hospitals');
        expect(listResponse.statusCode).toBe(200);
        expect(listResponse.body.hospitals.length).toBeGreaterThan(0);

        const hospitalId = listResponse.body.hospitals[0].id;
        const getResponse = await request(app).get(`/hospitals/${hospitalId}`);
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.hospital.id).toBe(hospitalId);
    });

    test('PUT /hospitals/:id should update hospital and handle failures', async () => {
        const createResponse = await request(app)
            .post('/hospitals')
            .send({ name: 'County Hospital', email: 'county@example.com', phone: '+254700000005', city: 'Kisumu', address: 'Lake Road' });

        const updateResponse = await request(app)
            .put(`/hospitals/${createResponse.body.hospital.id}`)
            .send({ name: 'County Referral Hospital', email: 'county@example.com', phone: '+254700000005', city: 'Kisumu', address: 'Lake Road' });

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.hospital.name).toBe('County Referral Hospital');

        const invalidResponse = await request(app).post('/hospitals').send({ name: 'Bad' });
        expect(invalidResponse.statusCode).toBe(400);

        const missingResponse = await request(app).get('/hospitals/missing');
        expect(missingResponse.statusCode).toBe(404);
    });
});
