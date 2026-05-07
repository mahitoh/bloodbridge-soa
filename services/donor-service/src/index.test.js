const request = require('supertest');
const app = require('./index');

describe('Donor Service', () => {
    test('returns a healthy status from /health', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'donor-service' });
    });
});
