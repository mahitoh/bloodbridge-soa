module.exports = {
    openapi: '3.0.0',
    info: { title: 'BloodBridge Notification Service', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3006' }],
    paths: {
        '/health': { get: { summary: 'Health check', responses: { 200: { description: 'Service is healthy' } } } },
        '/notify/donor': {
            post: {
                summary: 'Queue donor SMS notification',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DonorNotification' } } } },
                responses: { 202: { description: 'Notification queued' }, 400: { description: 'Validation failed' } }
            }
        },
        '/notify/hospital': {
            post: {
                summary: 'Queue hospital email notification',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HospitalNotification' } } } },
                responses: { 202: { description: 'Notification queued' }, 400: { description: 'Validation failed' } }
            }
        }
    },
    components: {
        schemas: {
            DonorNotification: {
                type: 'object',
                required: ['donorId', 'phone', 'message'],
                properties: {
                    donorId: { type: 'string', example: 'donor_1' },
                    phone: { type: 'string', example: '+254700000001' },
                    message: { type: 'string', example: 'A nearby hospital needs O+ blood.' }
                }
            },
            HospitalNotification: {
                type: 'object',
                required: ['hospitalId', 'email', 'subject', 'message'],
                properties: {
                    hospitalId: { type: 'string', example: 'hospital_1' },
                    email: { type: 'string', example: 'bloodbank@knh.example' },
                    subject: { type: 'string', example: 'Donor matched' },
                    message: { type: 'string', example: 'A donor has accepted your request.' }
                }
            }
        }
    }
};
