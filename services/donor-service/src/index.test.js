const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./app');

const TEST_TOKEN = jwt.sign({ id: 'test-user', email: 'test@test.com', role: 'donor' }, 'dev-secret');
const AUTH_HEADER = { Authorization: `Bearer ${TEST_TOKEN}` };

// Mock the database pool
jest.mock('./config/db', () => {
    const mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params = []) => {
        if (query.includes('SELECT id, name, email, role, bloodtype, phone, city FROM users')) {
            return Promise.resolve({
                rows: [{
                    id: params[0],
                    name: 'Test User',
                    email: 'test@test.com',
                    role: 'donor',
                    bloodtype: 'O+',
                    phone: '123',
                    city: 'Test City'
                }]
            });
        }
        if (query.includes('SELECT id, name, blood_type')) {
            if (query.includes('WHERE email = $1')) {
                return Promise.resolve({
                    rows: [{
                        id: 'test-donor-id',
                        name: 'Test Donor',
                        blood_type: 'O+',
                        phone: '123',
                        city: 'Test City',
                        email: 'test@test.com',
                        latitude: 0,
                        longitude: 0,
                        available: true,
                        created_at: new Date().toISOString()
                    }]
                });
            }
            if (query.includes('WHERE id = $1') && params[0] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            if (query.includes('WHERE id = $1')) {
                return Promise.resolve({
                    rows: [{
                        id: params[0],
                        name: 'Test Donor',
                        blood_type: 'O+',
                        phone: '123',
                        city: 'Test City',
                        latitude: 0,
                        longitude: 0,
                        available: true,
                        created_at: new Date().toISOString()
                    }]
                });
            }
            return Promise.resolve({
                rows: [{
                    id: 'test-donor-id',
                    name: 'Brian Otieno',
                    blood_type: 'A-',
                    phone: '+254700000002',
                    city: 'Mombasa',
                    latitude: null,
                    longitude: null,
                    available: true,
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('INSERT INTO donors')) {
            return Promise.resolve({
                rows: [{
                    id: 'new-donor-id',
                    name: params[0],
                    blood_type: params[1],
                    phone: params[2],
                    city: params[3],
                    latitude: params[4],
                    longitude: params[5],
                    available: params[6],
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('UPDATE donors SET available')) {
            if (params[1] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            return Promise.resolve({
                rows: [{
                    id: params[1],
                    name: 'Test Donor',
                    blood_type: 'O+',
                    phone: '123',
                    city: 'Test City',
                    latitude: 0,
                    longitude: 0,
                    available: params[0],
                    created_at: new Date().toISOString()
                }]
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
        del: jest.fn().mockResolvedValue(1),
        ping: jest.fn().mockResolvedValue('PONG'),
        quit: jest.fn().mockResolvedValue('OK'),
        on: jest.fn()
    };
});

describe('Donor Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'donor-service' });
    });

    test('POST /donors should create donor', async () => {
        const createResponse = await request(app)
            .post('/donors')
            .set(AUTH_HEADER)
            .send({ name: 'Brian Otieno', blood_type: 'A-', phone: '+254700000002', city: 'Mombasa' });

        expect(createResponse.statusCode).toBe(201);
        expect(createResponse.body.donor.id).toBeDefined();
        expect(createResponse.body.donor.name).toBe('Brian Otieno');
    });

    test('PUT /donors/:id/availability should update availability', async () => {
        const availabilityResponse = await request(app)
            .put('/donors/test-donor-id/availability')
            .set(AUTH_HEADER)
            .send({ available: false });

        expect(availabilityResponse.statusCode).toBe(200);
        expect(availabilityResponse.body.donor.available).toBe(false);
    });

    test('GET /donors should list donors', async () => {
        const listResponse = await request(app).get('/donors');
        expect(listResponse.statusCode).toBe(200);
        expect(listResponse.body.donors.length).toBeGreaterThan(0);
    });

    test('GET /donors/:id should fetch donor', async () => {
        const getResponse = await request(app).get('/donors/test-donor-id');
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.donor.id).toBe('test-donor-id');
    });

    test('donor endpoints should handle validation and not found cases', async () => {
        const invalidResponse = await request(app)
            .post('/donors')
            .set(AUTH_HEADER)
            .send({ name: 'A' });
        expect(invalidResponse.statusCode).toBe(400);

        const missingResponse = await request(app).get('/donors/missing');
        expect(missingResponse.statusCode).toBe(404);

        const missingAvailabilityResponse = await request(app)
            .put('/donors/missing/availability')
            .set(AUTH_HEADER)
            .send({ available: true });
        expect(missingAvailabilityResponse.statusCode).toBe(404);
    });

    test('GET /donors/:id should return cached donor', async () => {
        const redis = require('./config/redis');
        redis.get.mockResolvedValueOnce(JSON.stringify({ id: 'cached-donor', name: 'Cached Donor', blood_type: 'O+', city: 'Cache City', available: true, created_at: new Date().toISOString() }));
        
        const response = await request(app).get('/donors/cached-donor');
        expect(response.statusCode).toBe(200);
        expect(response.body.donor.name).toBe('Cached Donor');
        expect(response.body.source).toBe('cache');
    });

    test('updateDonorMetrics should update donor gauges', () => {
        const metrics = require('./metrics');

        expect(() => metrics.updateDonorMetrics([
            { available: true, blood_type: 'O+' },
            { available: false, blood_type: 'A+' },
            { available: true, blood_type: 'O+' }
        ])).not.toThrow();
    });

    test('GET /donors/me should return current donor profile', async () => {
        const response = await request(app)
            .get('/donors/me')
            .set(AUTH_HEADER);

        expect(response.statusCode).toBe(200);
        expect(response.body.donor).toBeDefined();
        expect(response.body.donor.id).toBe('test-donor-id');
    });
});
