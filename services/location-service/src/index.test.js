const request = require('supertest');
const app = require('./app');

// Mock the database pool
jest.mock('./config/db', () => {
    const mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params) => {
        if (query.includes('SELECT id, name, blood_type')) {
            return Promise.resolve({
                rows: [{
                    id: 'donor-1',
                    name: 'Test Donor',
                    blood_type: 'O+',
                    phone: '123',
                    city: 'Nairobi',
                    latitude: -1.2921,
                    longitude: 36.8219,
                    available: true,
                    distance: 1.5
                }]
            });
        }
        if (query.includes('SELECT (6371 * acos')) {
            return Promise.resolve({
                rows: [{ distance: 1.234 }]
            });
        }
        return Promise.resolve({ rows: [] });
    });

    return { query: mockQuery, end: jest.fn() };
});

// Mock Redis
jest.mock('./config/redis', () => {
    return {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        ping: jest.fn().mockResolvedValue('PONG'),
        quit: jest.fn().mockResolvedValue('OK'),
        on: jest.fn()
    };
});

describe('Location Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'location-service' });
    });

    test('POST /location/nearby should return nearby donors', async () => {
        const response = await request(app)
            .post('/location/nearby')
            .send({ latitude: -1.2921, longitude: 36.8219, radius: 10, blood_type: 'O+' });

        expect(response.statusCode).toBe(200);
        expect(response.body.donors.length).toBeGreaterThan(0);
    });

    test('POST /location/distance should calculate distance', async () => {
        const response = await request(app)
            .post('/location/distance')
            .send({ lat1: -1.2921, lon1: 36.8219, lat2: -1.3008, lon2: 36.8073 });

        expect(response.statusCode).toBe(200);
        expect(response.body.distance_km).toBeDefined();
    });

    test('location endpoints should validate request bodies', async () => {
        const response = await request(app).post('/location/nearby').send({ latitude: -1.2921 });
        expect(response.statusCode).toBe(400);
    });

    test('POST /location/distance should calculate distance', async () => {
        const response = await request(app)
            .post('/location/distance')
            .send({ lat1: -1.2921, lon1: 36.8219, lat2: -1.3008, lon2: 36.8073 });

        expect(response.statusCode).toBe(200);
        expect(response.body.distance_km).toBeDefined();
    });

    test('location endpoints should validate request bodies', async () => {
        const response = await request(app).post('/location/nearby').send({ latitude: -1.2921 });
        expect(response.statusCode).toBe(400);
    });
});
