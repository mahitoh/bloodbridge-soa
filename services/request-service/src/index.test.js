const request = require('supertest');
const app = require('./app');

var mockQuery;

jest.mock('./config/db', () => {
    mockQuery = jest.fn();
    mockQuery.mockImplementation((query, params = []) => {
        if (query.includes('SELECT id, hospital_id, blood_type')) {
            if (query.includes('WHERE id = $1') && params[0] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            if (query.includes('WHERE id = $1')) {
                return Promise.resolve({
                    rows: [{
                        id: params[0],
                        hospital_id: 'hospital_1',
                        blood_type: 'B+',
                        units: 3,
                        urgency: 'Critical',
                        radius: 20,
                        notes: null,
                        status: 'Active',
                        created_at: new Date().toISOString()
                    }]
                });
            }
            return Promise.resolve({
                rows: [{
                    id: 'test-request-id',
                    hospital_id: 'hospital_1',
                    blood_type: 'B+',
                    units: 3,
                    urgency: 'Critical',
                    radius: 20,
                    notes: null,
                    status: 'Active',
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('INSERT INTO requests')) {
            return Promise.resolve({
                rows: [{
                    id: 'new-request-id',
                    hospital_id: params[0],
                    blood_type: params[1],
                    units: params[2],
                    urgency: params[3],
                    radius: params[4],
                    notes: params[5],
                    status: params[6] || 'Active',
                    created_at: new Date().toISOString()
                }]
            });
        }
        if (query.includes('UPDATE requests SET status')) {
            if (params[1] === 'missing') {
                return Promise.resolve({ rows: [] });
            }
            return Promise.resolve({
                rows: [{
                    id: params[1],
                    hospital_id: 'hospital_1',
                    blood_type: 'B+',
                    units: 3,
                    urgency: 'Critical',
                    radius: 20,
                    notes: null,
                    status: params[0],
                    created_at: new Date().toISOString()
                }]
            });
        }
        return Promise.resolve({ rows: [] });
    });

    return { query: mockQuery, end: jest.fn() };
});
