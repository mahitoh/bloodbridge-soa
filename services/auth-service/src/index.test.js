const request = require('supertest');
const app = require('./index');

// Mock bcrypt and jwt for tests
describe('Auth Service', () => {
    beforeEach(() => {
        // Reset users array if possible, but since it's in memory, we can skip or use a separate test setup
    });

    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'auth-service' });
    });

    test('POST /auth/register should create a new user', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123',
            role: 'donor',
            name: 'Test User'
        };
        const response = await request(app).post('/auth/register').send(userData);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe(userData.email);
        expect(response.body.user.role).toBe(userData.role);
    });

    test('POST /auth/register should fail with missing email', async () => {
        const response = await request(app).post('/auth/register').send({ password: 'pass', role: 'donor' });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Email, password, and role are required');
    });

    test('POST /auth/register should fail with missing password', async () => {
        const response = await request(app).post('/auth/register').send({ email: 'test@ex.com', role: 'donor' });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Email, password, and role are required');
    });

    test('POST /auth/register should fail with missing role', async () => {
        const response = await request(app).post('/auth/register').send({ email: 'test@ex.com', password: 'pass' });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Email, password, and role are required');
    });

    test('POST /auth/login should authenticate user', async () => {
        const userData = {
            email: 'login@example.com',
            password: 'password123',
            role: 'hospital'
        };
        await request(app).post('/auth/register').send(userData);
        const response = await request(app).post('/auth/login').send({ email: userData.email, password: userData.password });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.token).toBeDefined();
    });

    test('POST /auth/login should fail with missing email', async () => {
        const response = await request(app).post('/auth/login').send({ password: 'pass' });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Email and password are required');
    });

    test('POST /auth/login should fail with missing password', async () => {
        const response = await request(app).post('/auth/login').send({ email: 'test@ex.com' });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Email and password are required');
    });

    test('POST /auth/verify should validate token', async () => {
        const userData = {
            email: 'verify@example.com',
            password: 'password123',
            role: 'donor'
        };
        const registerResponse = await request(app).post('/auth/register').send(userData);
        const token = registerResponse.body.token;
        const response = await request(app).post('/auth/verify').send({ token });
        expect(response.statusCode).toBe(200);
        expect(response.body.valid).toBe(true);
        expect(response.body.user.email).toBe(userData.email);
    });

    test('POST /auth/verify should fail with invalid token', async () => {
        const response = await request(app).post('/auth/verify').send({ token: 'invalid' });
        expect(response.statusCode).toBe(401);
        expect(response.body.valid).toBe(false);
    });
});
