const request = require('supertest');
const app = require('./app');

// Mock the database pool
jest.mock('./config/db', () => {
    const mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params = []) => {
        if (query.includes('SELECT id, hospital_id, blood_type')) {
            if (query.includes('WHERE id = $1') && params[0] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            if (query.includes('WHERE id = $1')) {
                return Promise.resolve({
                    rows: [{
                        id: params[0],
                        hospital_id: 'hospital_1',
                        blood_type: 'B+',
                        units: 3,
                        urgency: 'Critical',
                        radius: 20,
                        notes: null,
                        status: 'Active',
                        created_at: new Date().toISOString()
                    }]
                });
            }
            return Promise.resolve({
                rows: [{
                    id: 'test-request-id',
                    hospital_id: 'hospital_1',
                    blood_type: 'B+',
                    units: 3,
                    urgency: 'Critical',
                    radius: 20,
                    notes: null,
                    status: 'Active',
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('INSERT INTO requests')) {
            return Promise.resolve({
                rows: [{
                    id: 'new-request-id',
                    hospital_id: params[0],
                    blood_type: params[1],
                    units: params[2],
                    urgency: params[3],
                    radius: params[4],
                    notes: params[5],
                    status: params[6] || 'Active',
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('UPDATE requests SET status')) {
            if (params[1] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            return Promise.resolve({
                rows: [{
                    id: params[1],
                    hospital_id: 'hospital_1',
                    blood_type: 'B+',
                    units: 3,
                    urgency: 'Critical',
                    radius: 20,
                    notes: null,
                    status: params[0],
                    created_at: new Date().toISOString()
                }]
            });
        }
        return Promise.resolve({ rows: [] });
    });

    return { query: mockQuery, end: jest.fn() };
});

// Mock RabbitMQ
jest.mock('./config/rabbitmq', () => {
    return {
        connectRabbitMQ: jest.fn().mockResolvedValue(undefined),
        getChannel: jest.fn().mockReturnValue({
            sendToQueue: jest.fn()
        })
    };
});

describe('Request Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'request-service' });
    });

    test('POST /requests should create request', async () => {
        const createResponse = await request(app)
            .post('/requests')
            .send({ hospital_id: 'hospital_1', blood_type: 'B+', units: 3, urgency: 'Critical', radius: 20 });

        expect(createResponse.statusCode).toBe(201);
        expect(createResponse.body.request.id).toBeDefined();
        expect(createResponse.body.request.status).toBe('Active');
    });

    test('PUT /requests/:id/status should update status', async () => {
        const statusResponse = await request(app)
            .put('/requests/test-request-id/status')
            .send({ status: 'Fulfilled' });

        expect(statusResponse.statusCode).toBe(200);
        expect(statusResponse.body.request.status).toBe('Fulfilled');
    });

    test('GET /requests should list requests', async () => {
        const listResponse = await request(app).get('/requests');
        expect(listResponse.statusCode).toBe(200);
        expect(listResponse.body.requests.length).toBeGreaterThan(0);
    });

    test('GET /requests/:id should fetch request', async () => {
        const getResponse = await request(app).get('/requests/test-request-id');
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.request.id).toBe('test-request-id');
    });

    test('request endpoints should handle validation and not found cases', async () => {
        const invalidResponse = await request(app).post('/requests').send({ hospital_id: 'hospital_1' });
        expect(invalidResponse.statusCode).toBe(400);

        const missingResponse = await request(app).get('/requests/missing');
        expect(missingResponse.statusCode).toBe(404);

        const missingStatusResponse = await request(app)
            .put('/requests/missing/status')
            .send({ status: 'Cancelled' });
        expect(missingStatusResponse.statusCode).toBe(404);
    });

    test('GET /requests should filter by status and blood_type', async () => {
        const response = await request(app).get('/requests?status=Active&blood_type=O+');
        expect(response.statusCode).toBe(200);
        expect(response.body.requests).toBeDefined();
    });

    test('GET /nonexistent should return 404', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.statusCode).toBe(404);
    });

    test('request endpoints should handle server errors gracefully', async () => {
        mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));
        const response = await request(app).get('/requests');
        expect(response.statusCode).toBe(500);
    });
});
