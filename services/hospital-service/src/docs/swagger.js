module.exports = {
    openapi: '3.0.0',
    info: { title: 'BloodBridge Hospital Service', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3003' }],
    paths: {
        '/health': { get: { summary: 'Health check', responses: { 200: { description: 'Service is healthy' } } } },
        '/hospitals': {
            get: { summary: 'List hospitals', responses: { 200: { description: 'Hospital list' } } },
            post: {
                summary: 'Create hospital',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HospitalRequest' } } } },
                responses: { 201: { description: 'Hospital created' }, 400: { description: 'Validation failed' } }
            }
        },
        '/hospitals/{id}': {
            get: {
                summary: 'Get hospital by id',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Hospital found' }, 404: { description: 'Hospital not found' } }
            },
            put: {
                summary: 'Update hospital',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HospitalRequest' } } } },
                responses: { 200: { description: 'Hospital updated' }, 404: { description: 'Hospital not found' } }
            }
        }
    },
    components: {
        schemas: {
            HospitalRequest: {
                type: 'object',
                required: ['name', 'email', 'phone', 'city', 'address'],
                properties: {
                    name: { type: 'string', example: 'Kenyatta National Hospital' },
                    email: { type: 'string', example: 'bloodbank@knh.example' },
                    phone: { type: 'string', example: '+254700000003' },
                    city: { type: 'string', example: 'Nairobi' },
                    address: { type: 'string', example: 'Hospital Road' },
                    latitude: { type: 'number', example: -1.3008 },
                    longitude: { type: 'number', example: 36.8073 }
                }
            }
        }
    }
};
