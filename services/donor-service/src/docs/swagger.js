module.exports = {
    openapi: '3.0.0',
    info: { title: 'BloodBridge Donor Service', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3002' }],
    paths: {
        '/health': { get: { summary: 'Health check', responses: { 200: { description: 'Service is healthy' } } } },
        '/donors': {
            get: { summary: 'List donors', responses: { 200: { description: 'Donor list' } } },
            post: {
                summary: 'Create donor profile',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DonorRequest' } } } },
                responses: { 201: { description: 'Donor created' }, 400: { description: 'Validation failed' } }
            }
        },
        '/donors/{id}': {
            get: {
                summary: 'Get donor by id',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Donor found' }, 404: { description: 'Donor not found' } }
            }
        },
        '/donors/{id}/availability': {
            put: {
                summary: 'Update donor availability',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { available: { type: 'boolean' } }, required: ['available'] } } } },
                responses: { 200: { description: 'Availability updated' }, 404: { description: 'Donor not found' } }
            }
        }
    },
    components: {
        schemas: {
            DonorRequest: {
                type: 'object',
                required: ['name', 'bloodType', 'phone', 'city'],
                properties: {
                    name: { type: 'string', example: 'Amina Noor' },
                    bloodType: { type: 'string', example: 'O+' },
                    phone: { type: 'string', example: '+254700000001' },
                    city: { type: 'string', example: 'Nairobi' },
                    latitude: { type: 'number', example: -1.2921 },
                    longitude: { type: 'number', example: 36.8219 },
                    available: { type: 'boolean', example: true }
                }
            }
        }
    }
};
