const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./app');

const TEST_TOKEN = jwt.sign({ id: 'test-hospital', email: 'hospital@test.com', role: 'hospital' }, 'dev-secret');
const AUTH_HEADER = { Authorization: `Bearer ${TEST_TOKEN}` };

// Mock ONLY the database pool. The models will use this mock, ensuring their code is executed and covered.
jest.mock('./config/db', () => {
    const mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params = []) => {
        if (query.includes('SELECT id, name, email, role FROM users WHERE id = $1')) {
            if (params[0] === 'test-hospital') {
                return Promise.resolve({
                    rows: [{
                        id: 'test-hospital',
                        name: 'Test Hospital',
                        email: 'hospital@test.com',
                        role: 'hospital'
                    }]
                });
            }
            return Promise.resolve({ rows: [] });
        }

        // hospital.model.js & hospital.controller.js queries
        if (query.includes('SELECT id, name, email, phone, city, address, latitude, longitude, created_at FROM hospitals WHERE id = $1')) {
            if (params[0] === '00000000-0000-0000-0000-000000000000' || params[0] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            return Promise.resolve({
                rows: [{
                    id: params[0],
                    name: 'Test Hospital',
                    email: 'test@example.com',
                    phone: '+254700000005',
                    city: 'Kisumu',
                    address: 'Lake Road',
                    latitude: null,
                    longitude: null,
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('SELECT id, name, email, phone, city, address, latitude, longitude, created_at FROM hospitals ORDER BY name ASC')) {
            return Promise.resolve({
                rows: [{
                    id: 'test-hospital-id',
                    name: 'City Hospital',
                    email: 'city@example.com',
                    phone: '+254700000004',
                    city: 'Nakuru',
                    address: 'Main Street',
                    latitude: null,
                    longitude: null,
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('INSERT INTO hospitals')) {
            return Promise.resolve({
                rows: [{
                    id: 'new-hospital-id',
                    name: params[0],
                    email: params[1],
                    phone: params[2],
                    city: params[3],
                    address: params[4],
                    latitude: params[5],
                    longitude: params[6],
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('UPDATE hospitals')) {
            if (params[7] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            return Promise.resolve({
                rows: [{
                    id: params[7],
                    name: params[0] || 'County Hospital',
                    email: params[1] || 'county@example.com',
                    phone: params[2] || '+254700000005',
                    city: params[3] || 'Kisumu',
                    address: params[4] || 'Lake Road',
                    latitude: params[5],
                    longitude: params[6],
                    created_at: new Date().toISOString()
                }]
            });
        }
        
        // bloodInventory.model.js queries
        if (query.includes('SELECT blood_type, units_available, units_reserved FROM blood_inventory WHERE hospital_id = $1')) {
            return Promise.resolve({ rows: [] });
        }
        if (query.includes('INSERT INTO blood_inventory') || query.includes('ON CONFLICT')) {
            return Promise.resolve({
                rows: [{ blood_type: params[1], units_available: params[2], units_reserved: params[3] }]
            });
        }
        if (query.includes('UPDATE blood_inventory') && query.includes('units_reserved = units_reserved +')) {
            if (params[2] === 999) return Promise.resolve({ rows: [] }); // Trigger insufficient units error
            return Promise.resolve({ rows: [{ blood_type: params[1], units_available: 8, units_reserved: 2 }] });
        }
        if (query.includes('UPDATE blood_inventory') && query.includes('units_reserved = units_reserved -') && query.includes('units_available = units_available +')) {
            if (params[2] === 999) return Promise.resolve({ rows: [] }); // Trigger cannot release error
            return Promise.resolve({ rows: [{ blood_type: params[1], units_available: 10, units_reserved: 0 }] });
        }
        if (query.includes('UPDATE blood_inventory') && query.includes('units_reserved = units_reserved -') && query.includes('units_available = units_available -')) {
            if (params[2] === 999) return Promise.resolve({ rows: [] }); // Trigger insufficient reserved error
            return Promise.resolve({ rows: [{ blood_type: params[1], units_available: 8, units_reserved: 0 }] });
        }

        return Promise.resolve({ rows: [] });
    });

    return { query: mockQuery, end: jest.fn() };
});

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
            .set(AUTH_HEADER)
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
        const updateResponse = await request(app)
            .put('/hospitals/test-hospital-id')
            .set(AUTH_HEADER)
            .send({ name: 'County Referral Hospital', email: 'county@example.com', phone: '+254700000005', city: 'Kisumu', address: 'Lake Road' });

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.hospital.name).toBe('County Referral Hospital');

        const invalidResponse = await request(app)
            .post('/hospitals')
            .set(AUTH_HEADER)
            .send({ name: 'Bad' });
        expect(invalidResponse.statusCode).toBe(400);

        const missingResponse = await request(app).get('/hospitals/missing');
        expect(missingResponse.statusCode).toBe(404);
    });

    test('GET /hospitals/:hospitalId/inventory should return inventory', async () => {
        const response = await request(app).get('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory');
        expect(response.statusCode).toBe(200);
        expect(response.body.inventory).toEqual([]);
    });

    test('GET /hospitals/:hospitalId/inventory should return 404 for missing hospital', async () => {
        const response = await request(app).get('/hospitals/00000000-0000-0000-0000-000000000000/inventory');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Hospital not found');
    });

    test('PUT /hospitals/:hospitalId/inventory/:bloodType should update inventory', async () => {
        const response = await request(app)
            .put('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+')
            .send({ unitsAvailable: 10, unitsReserved: 0 });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('updated successfully');
    });

    test('PUT /hospitals/:hospitalId/inventory/:bloodType should handle negative units', async () => {
        const response = await request(app)
            .put('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+')
            .send({ unitsAvailable: -5, unitsReserved: 0 });
        expect(response.statusCode).toBe(400);
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/reserve should reserve blood', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/reserve')
            .send({ units: 2 });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Reserved');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/reserve should handle invalid units', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/reserve')
            .send({ units: 0 });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Valid units required');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/release should release blood', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/release')
            .send({ units: 1 });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Released');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/release should handle invalid units', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/release')
            .send({ units: -1 });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Valid units required');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/consume should consume blood', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/consume')
            .send({ units: 1 });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Consumed');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/consume should handle invalid units', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/consume')
            .send({ units: 0 });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Valid units required');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/reserve should handle insufficient units', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/reserve')
            .send({ units: 999 });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Insufficient blood units available');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/release should handle insufficient reserved units', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/release')
            .send({ units: 999 });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Cannot release more units than reserved');
    });

    test('POST /hospitals/:hospitalId/inventory/:bloodType/consume should handle insufficient reserved units', async () => {
        const response = await request(app)
            .post('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory/O+/consume')
            .send({ units: 999 });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Insufficient reserved units to consume');
    });
});
