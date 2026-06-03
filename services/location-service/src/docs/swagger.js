module.exports = {
    openapi: '3.0.0',
    info: { title: 'BloodBridge Location Service', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3005' }],
    paths: {
        '/health': { get: { summary: 'Health check', responses: { 200: { description: 'Service is healthy' } } } },
        '/location/nearby': {
            post: {
                summary: 'Find nearby donors',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/NearbyRequest' } } } },
                responses: { 200: { description: 'Nearby donors' }, 400: { description: 'Validation failed' } }
            }
        },
        '/location/distance': {
            post: {
                summary: 'Calculate distance between two coordinates',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DistanceRequest' } } } },
                responses: { 200: { description: 'Distance calculated' }, 400: { description: 'Validation failed' } }
            }
        }
    },
    components: {
        schemas: {
            NearbyRequest: {
                type: 'object',
                required: ['latitude', 'longitude'],
                properties: {
                    latitude: { type: 'number', example: -1.2921 },
                    longitude: { type: 'number', example: 36.8219 },
                    radiusKm: { type: 'number', example: 10 },
                    bloodType: { type: 'string', example: 'O+' }
                }
            },
            DistanceRequest: {
                type: 'object',
                required: ['from', 'to'],
                properties: {
                    from: { type: 'object', properties: { latitude: { type: 'number' }, longitude: { type: 'number' } } },
                    to: { type: 'object', properties: { latitude: { type: 'number' }, longitude: { type: 'number' } } }
                }
            }
        }
    }
};
