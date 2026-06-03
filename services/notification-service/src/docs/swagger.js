module.exports = {
    openapi: '3.0.0',
    info: { title: 'BloodBridge Notification Service', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3006' }],
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                responses: { 200: { description: 'Service is healthy' } }
            }
        },
        '/notify/sms': {
            post: {
                summary: 'Queue SMS notification',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SmsNotification' }
                        }
                    }
                },
                responses: {
                    202: { description: 'SMS notification queued' },
                    400: { description: 'Validation failed' }
                }
            }
        },
        '/notify/email': {
            post: {
                summary: 'Queue email notification',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/EmailNotification' }
                        }
                    }
                },
                responses: {
                    202: { description: 'Email notification queued' },
                    400: { description: 'Validation failed' }
                }
            }
        },
        '/notify/donor': {
            post: {
                summary: 'Queue donor SMS notification',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/DonorNotification' }
                        }
                    }
                },
                responses: {
                    202: { description: 'Donor notification queued' },
                    400: { description: 'Validation failed' }
                }
            }
        },
        '/notify/hospital': {
            post: {
                summary: 'Queue hospital email notification',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/HospitalNotification' }
                        }
                    }
                },
                responses: {
                    202: { description: 'Hospital notification queued' },
                    400: { description: 'Validation failed' }
                }
            }
        },
        '/notify/history': {
            get: {
                summary: 'Get notification history',
                responses: {
                    200: { description: 'Notification history retrieved' }
                }
            }
        },
        '/notify/history/{id}': {
            get: {
                summary: 'Get notification by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: { description: 'Notification retrieved' },
                    404: { description: 'Notification not found' }
                }
            }
        }
    },
    components: {
        schemas: {
            SmsNotification: {
                type: 'object',
                required: ['phone', 'message'],
                properties: {
                    phone: { type: 'string', example: '+237600000000' },
                    message: { type: 'string', example: 'A nearby hospital needs O+ blood.' }
                }
            },
            EmailNotification: {
                type: 'object',
                required: ['email', 'subject', 'message'],
                properties: {
                    email: { type: 'string', example: 'bloodbank@example.com' },
                    subject: { type: 'string', example: 'BloodBridge Notification' },
                    message: { type: 'string', example: 'Your blood request has been updated.' }
                }
            },
            DonorNotification: {
                type: 'object',
                required: ['donorId', 'phone', 'message'],
                properties: {
                    donorId: { type: 'string', example: 'donor_1' },
                    phone: { type: 'string', example: '+237600000000' },
                    message: { type: 'string', example: 'A nearby hospital needs O+ blood.' }
                }
            },
            HospitalNotification: {
                type: 'object',
                required: ['hospitalId', 'email', 'subject', 'message'],
                properties: {
                    hospitalId: { type: 'string', example: 'hospital_1' },
                    email: { type: 'string', example: 'bloodbank@example.com' },
                    subject: { type: 'string', example: 'Donor matched' },
                    message: { type: 'string', example: 'A donor has accepted your request.' }
                }
            }
        }
    }
};
