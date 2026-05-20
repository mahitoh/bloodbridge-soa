module.exports = {
    openapi: '3.0.0',
    info: { title: 'BloodBridge Auth Service', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3001' }],
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                responses: { 200: { description: 'Service is healthy' } }
            }
        },
        '/auth/register': {
            post: {
                summary: 'Register a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterRequest' }
                        }
                    }
                },
                responses: { 201: { description: 'User registered' }, 409: { description: 'Email already registered' } }
            }
        },
        '/auth/login': {
            post: {
                summary: 'Login a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' }
                        }
                    }
                },
                responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } }
            }
        },
        '/auth/verify': {
            post: {
                summary: 'Verify a JWT',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['token'], properties: { token: { type: 'string' } } }
                        }
                    }
                },
                responses: { 200: { description: 'Token is valid' }, 401: { description: 'Token is invalid' } }
            }
        }
    },
    components: {
        schemas: {
            RegisterRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', example: 'Amina Noor' },
                    email: { type: 'string', example: 'amina@example.com' },
                    password: { type: 'string', example: 'secret123' },
                    role: { type: 'string', enum: ['DONOR', 'HOSPITAL', 'ADMIN'], example: 'DONOR' },
                    bloodType: { type: 'string', example: 'O+' },
                    phone: { type: 'string', example: '+254700000000' },
                    city: { type: 'string', example: 'Nairobi' }
                }
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', example: 'amina@example.com' },
                    password: { type: 'string', example: 'secret123' }
                }
            }
        }
    }
};
