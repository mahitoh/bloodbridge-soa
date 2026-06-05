module.exports = {
    openapi: '3.0.0',
    info: { title: 'BloodBridge Request Service', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3004' }],
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                responses: { 200: { description: 'Service is healthy' } }
            }
        },
        '/requests': {
            get: {
                summary: 'List blood requests',
                responses: { 200: { description: 'Request list' } }
            },
            post: {
                summary: 'Create blood request',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BloodRequest' }
                        }
                    }
                },
                responses: {
                    201: { description: 'Request created' },
                    400: { description: 'Validation failed' }
                }
            }
        },
        '/requests/{id}': {
            get: {
                summary: 'Get request by id',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Request found' },
                    404: { description: 'Request not found' }
                }
            }
        },
        '/requests/{id}/status': {
            put: {
                summary: 'Update request status',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RequestStatusUpdate' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Status updated' },
                    400: { description: 'Validation failed' },
                    404: { description: 'Request not found' }
                }
            }
        }
    },
    components: {
        schemas: {
            BloodRequest: {
                type: 'object',
                required: ['hospital_id', 'blood_type', 'units'],
                properties: {
                    hospital_id: { type: 'string', example: 'hospital_1' },
                    blood_type: { type: 'string', example: 'O+' },
                    units: { type: 'integer', example: 2 },
                    urgency: { type: 'string', enum: ['Standard', 'Urgent', 'Critical'], example: 'Urgent' },
                    radius: { type: 'integer', example: 20 },
                    notes: { type: 'string', example: 'Emergency surgery' },
                    status: { type: 'string', enum: ['Active', 'Fulfilled', 'Cancelled'], example: 'Active' }
                }
            },
            RequestStatusUpdate: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: { type: 'string', enum: ['Active', 'Fulfilled', 'Cancelled'], example: 'Fulfilled' }
                }
            }
        }
    }
};