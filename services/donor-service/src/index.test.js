const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./index');

const JWT_SECRET = 'your-secret-key';
let token;

beforeAll(() => {
    token = jwt.sign({ id: 1, email: 'test@example.com', role: 'donor' }, JWT_SECRET);
});

describe('Donor Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'donor-service' });
    });

    test('POST /donors should create a donor', async () => {
        const donorData = {
            name: 'John Doe',
            email: 'john@example.com',
            bloodType: 'O+',
            location: 'Yaoundé',
            phone: '+237123456789'
        };
        const response = await request(app)
            .post('/donors')
            .set('Authorization', `Bearer ${token}`)
            .send(donorData);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(donorData.name);
        expect(response.body.bloodType).toBe(donorData.bloodType);
    });

    test('GET /donors/:id should return donor', async () => {
        // Assuming donor with id 1 exists from previous test
        const response = await request(app)
            .get('/donors/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test('PUT /donors/:id should update donor', async () => {
        const response = await request(app)
            .put('/donors/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Jane Doe' });
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Jane Doe');
    });

    test('PUT /donors/:id/availability should toggle availability', async () => {
        const response = await request(app)
            .put('/donors/1/availability')
            .set('Authorization', `Bearer ${token}`)
            .send({ available: false });
        expect(response.statusCode).toBe(200);
        expect(response.body.available).toBe(false);
    });

    test('GET /donors/blood/:type should return donors by blood type', async () => {
        const response = await request(app)
            .get('/donors/blood/O+')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /donors/:id/history should return history', async () => {
        const response = await request(app)
            .get('/donors/1/history')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /donors/:id should return 404 for non-existent donor', async () => {
        const response = await request(app)
            .get('/donors/999')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404);
    });
});
