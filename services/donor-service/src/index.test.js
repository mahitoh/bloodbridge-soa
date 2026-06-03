const request = require('supertest');
const app = require('./app');

describe('Donor Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'donor-service' });
    });

    test('GET /metrics returns prometheus metrics', async () => {
        const response = await request(app).get('/metrics');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('http_requests_total');
        expect(response.text).toContain('bloodbridge_total_donors');
    });

    test('POST /donors should create donor and update availability', async () => {
        const createResponse = await request(app)
            .post('/donors')
            .send({ name: 'Brian Otieno', bloodType: 'A-', phone: '+254700000002', city: 'Mombasa' });

        expect(createResponse.statusCode).toBe(201);
        expect(createResponse.body.donor.id).toBeDefined();

        const availabilityResponse = await request(app)
            .put(`/donors/${createResponse.body.donor.id}/availability`)
            .send({ available: false });

        expect(availabilityResponse.statusCode).toBe(200);
        expect(availabilityResponse.body.donor.available).toBe(false);
    });

    test('GET /donors should list and fetch donors', async () => {
        const listResponse = await request(app).get('/donors');
        expect(listResponse.statusCode).toBe(200);
        expect(listResponse.body.donors.length).toBeGreaterThan(0);

        const donorId = listResponse.body.donors[0].id;
        const getResponse = await request(app).get(`/donors/${donorId}`);
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.donor.id).toBe(donorId);
    });

    test('donor endpoints should handle validation and not found cases', async () => {
        const invalidResponse = await request(app).post('/donors').send({ name: 'A' });
        expect(invalidResponse.statusCode).toBe(400);

        const missingResponse = await request(app).get('/donors/missing');
        expect(missingResponse.statusCode).toBe(404);

        const missingAvailabilityResponse = await request(app)
            .put('/donors/missing/availability')
            .send({ available: true });
        expect(missingAvailabilityResponse.statusCode).toBe(404);
    });
});
