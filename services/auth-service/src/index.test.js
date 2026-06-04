var mockQuery;

jest.mock('./config/db', () => {
    mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params = []) => {
        if (query.includes('SELECT id FROM users WHERE email')) {
            if (params[0] === 'duplicate@example.com') {
                return Promise.resolve({ rows: [{ id: '1' }] });
            }
            return Promise.resolve({ rows: [] });
        }
        if (query.includes('INSERT INTO users')) {
            return Promise.resolve({
                rows: [{
                    id: 'test-user-id',
                    name: params[0] || 'Test User',
                    email: params[1] || 'test@example.com',
                    role: params[3] || 'DONOR',
                    bloodtype: params[4] || 'O+',
                    phone: params[5] || '123',
                    city: params[6] || 'City'
                }]
            });
        }
        if (query.includes('SELECT * FROM users WHERE email')) {
            if (params[0] === 'test@example.com') {
                return Promise.resolve({
                    rows: [{
                        id: 'test-user-id',
                        name: 'Test User',
                        email: 'test@example.com',
                        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.QhK5J5J5J5J5J5J5',
                        role: 'DONOR',
                        bloodtype: 'O+',
                        phone: '1234567890',
                        city: 'Test City'
                    }]
                });
            }
            return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
    });

    return {
        query: mockQuery,
        end: jest.fn()
    };
});

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockImplementation((password, hash) => {
        return Promise.resolve(password === 'secret123');
    })
}));

const request = require('supertest');
const app = require('./app');

describe('Auth Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'auth-service' });
    });

    test('POST /auth/register should create a new user', async () => {
        const email = `amina-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post('/auth/register')
            .send({ name: 'Amina Noor', email, password: 'secret123', role: 'DONOR', bloodType: 'O+' });

        expect(registerResponse.statusCode).toBe(201);
        expect(registerResponse.body.token).toBeDefined();
        expect(registerResponse.body.user.email).toBe(email);
    });

    test('POST /auth/login should authenticate valid user', async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'secret123' });

        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body.token).toBeDefined();
        expect(loginResponse.body.user.email).toBe('test@example.com');
    });

    test('POST /auth/verify should validate a correct token', async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'secret123' });
        
        const token = loginResponse.body.token;

        const verifyResponse = await request(app)
            .post('/auth/verify')
            .send({ token });

        expect(verifyResponse.statusCode).toBe(200);
        expect(verifyResponse.body.valid).toBe(true);
    });

    test('auth endpoints should handle duplicate, invalid, and validation cases', async () => {
        const duplicateResponse = await request(app)
            .post('/auth/register')
            .send({ name: 'Duplicate User', email: 'duplicate@example.com', password: 'secret123', role: 'DONOR' });
        expect(duplicateResponse.statusCode).toBe(409);

        const invalidLoginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'wrong-password' });
        expect(invalidLoginResponse.statusCode).toBe(401);

        const invalidVerifyResponse = await request(app)
            .post('/auth/verify')
            .send({ token: 'not-a-real-token' });
        expect(invalidVerifyResponse.statusCode).toBe(401);

        const validationResponse = await request(app).post('/auth/register').send({ name: 'A' });
        expect(validationResponse.statusCode).toBe(400);
    });

    test('GET /api-docs should serve swagger ui', async () => {
        const response = await request(app).get('/api-docs/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Swagger UI');
    });

    test('GET /nonexistent should return 404', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.statusCode).toBe(404);
    });

    test('auth endpoints should handle server errors gracefully', async () => {
        mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));
        const response = await request(app).post('/auth/login').send({ email: 'test@example.com', password: 'secret123' });
        expect(response.statusCode).toBe(500);
    });
});
