const request = require('supertest');
const app = require('./app');

// Mock the models
jest.mock('./models/hospital.model', () => ({
    getHospitalById: jest.fn().mockResolvedValue({ id: 'test-hospital-id', name: 'Test Hospital' })
}));

jest.mock('./models/bloodInventory.model', () => ({
    getBloodInventoryByHospitalId: jest.fn().mockResolvedValue([]),
    updateBloodInventory: jest.fn().mockResolvedValue({ blood_type: 'O+', units_available: 10, units_reserved: 0 }),
    reserveBloodUnits: jest.fn().mockResolvedValue({ blood_type: 'O+', units_available: 8, units_reserved: 2 }),
    releaseBloodUnits: jest.fn().mockResolvedValue({ blood_type: 'O+', units_available: 10, units_reserved: 0 }),
    consumeBloodUnits: jest.fn().mockResolvedValue({ blood_type: 'O+', units_available: 8, units_reserved: 0 })
}));

// Mock the database pool
jest.mock('./config/db', () => {
    const mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params) => {
        if (query.includes('SELECT id, name, email')) {
            if (query.includes('WHERE id = $1') && params[0] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            if (query.includes('WHERE id = $1')) {
                return Promise.resolve({
                    rows: [{
                        id: params[0],
                        name: 'Updated Hospital',
                        email: 'updated@example.com',
                        phone: '+254700000005',
                        city: 'Kisumu',
                        address: 'Lake Road',
                        latitude: null,
                        longitude: null,
                        created_at: new Date().toISOString()
                    }]
                });
            }
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
        const updateResponse = await request(app)
            .put('/hospitals/test-hospital-id')
            .send({ name: 'County Referral Hospital', email: 'county@example.com', phone: '+254700000005', city: 'Kisumu', address: 'Lake Road' });

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.hospital.name).toBe('County Referral Hospital');

        const invalidResponse = await request(app).post('/hospitals').send({ name: 'Bad' });
        expect(invalidResponse.statusCode).toBe(400);

        const missingResponse = await request(app).get('/hospitals/missing');
        expect(missingResponse.statusCode).toBe(404);
    });

    test('GET /hospitals/:hospitalId/inventory should return inventory', async () => {
        const response = await request(app).get('/hospitals/123e4567-e89b-12d3-a456-426614174000/inventory');
        expect(response.statusCode).toBe(200);
        expect(response.body.inventory).toEqual([]);
    });
});
