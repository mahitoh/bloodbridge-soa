const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./index');

const JWT_SECRET = 'your-secret-key';
let token;

beforeAll(() => {
    token = jwt.sign({ id: 1, email: 'test@example.com', role: 'hospital' }, JWT_SECRET);
});

describe('Hospital Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'hospital-service' });
    });

    test('POST /hospitals should create a hospital', async () => {
        const hospData = {
            name: 'Hospital A',
            email: 'hospital@example.com',
            phone: '+237123456789',
            address: '123 Main St',
            city: 'Yaoundé',
            registrationNumber: 'REG123'
        };
        const response = await request(app)
            .post('/hospitals')
            .set('Authorization', `Bearer ${token}`)
            .send(hospData);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(hospData.name);
    });

    test('GET /hospitals/:id should return hospital', async () => {
        const response = await request(app)
            .get('/hospitals/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test('PUT /hospitals/:id should update hospital', async () => {
        const response = await request(app)
            .put('/hospitals/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ phone: '+237987654321' });
        expect(response.statusCode).toBe(200);
        expect(response.body.phone).toBe('+237987654321');
    });

    test('PUT /hospitals/:id/beds should update beds', async () => {
        const response = await request(app)
            .put('/hospitals/1/beds')
            .set('Authorization', `Bearer ${token}`)
            .send({ beds: 50 });
        expect(response.statusCode).toBe(200);
        expect(response.body.beds).toBe(50);
    });

    test('GET /hospitals/:id should return 404 for non-existent hospital', async () => {
        const response = await request(app)
            .get('/hospitals/999')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404);
    });
});
