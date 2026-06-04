const request = require('supertest');
const app = require('./app');

// Mock the database pool - hoist mockQuery for test access
let mockQuery;

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
