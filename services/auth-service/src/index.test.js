const request = require('supertest');
const app = require('./app');

describe('Auth Service', () => {
    test('GET /health should return 200 and status healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'healthy', service: 'auth-service' });
    });

    test('POST /auth/register, /auth/login, and /auth/verify should complete auth flow', async () => {
        const email = `amina-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post('/auth/register')
            .send({ name: 'Amina Noor', email, password: 'secret123', role: 'DONOR', bloodType: 'O+' });

        expect(registerResponse.statusCode).toBe(201);
        expect(registerResponse.body.token).toBeDefined();
        expect(registerResponse.body.user.email).toBe(email);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email, password: 'secret123' });

        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body.token).toBeDefined();

        const verifyResponse = await request(app)
            .post('/auth/verify')
            .send({ token: loginResponse.body.token });

        expect(verifyResponse.statusCode).toBe(200);
        expect(verifyResponse.body.valid).toBe(true);
    });

    test('GET /api-docs should serve swagger ui', async () => {
        const response = await request(app).get('/api-docs/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Swagger UI');
    });

    test('auth endpoints should handle duplicate, invalid, and validation cases', async () => {
        const email = `duplicate-${Date.now()}@example.com`;
        const payload = { name: 'Duplicate User', email, password: 'secret123', role: 'DONOR' };

        await request(app).post('/auth/register').send(payload);

        const duplicateResponse = await request(app).post('/auth/register').send(payload);
        expect(duplicateResponse.statusCode).toBe(409);

        const invalidLoginResponse = await request(app)
            .post('/auth/login')
            .send({ email, password: 'wrong-password' });
        expect(invalidLoginResponse.statusCode).toBe(401);

        const invalidVerifyResponse = await request(app)
            .post('/auth/verify')
            .send({ token: 'not-a-real-token' });
        expect(invalidVerifyResponse.statusCode).toBe(401);

        const validationResponse = await request(app).post('/auth/register').send({ name: 'A' });
        expect(validationResponse.statusCode).toBe(400);
    });
});
