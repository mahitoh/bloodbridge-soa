require('dotenv').config({ path: '../../.env' }); // Adjust path as needed

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const requests = []; // In-memory storage for demo

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'request-service' });
});

// Create request
app.post('/requests', authenticate, (req, res) => {
    const { hospitalId, bloodType, unitsNeeded, urgency, location } = req.body;
    if (!hospitalId || !bloodType || !unitsNeeded || !urgency) {
        return res.status(400).json({ error: 'Hospital ID, blood type, units needed, and urgency are required' });
    }
    const request = {
        id: requests.length + 1,
        hospitalId,
        bloodType,
        unitsNeeded,
        urgency,
        location,
        status: 'active',
        createdAt: new Date(),
        notifiedDonors: []
    };
    requests.push(request);
    res.status(201).json(request);
});

// Get all requests
app.get('/requests', authenticate, (req, res) => {
    res.json(requests);
});

// Get request by ID
app.get('/requests/:id', authenticate, (req, res) => {
    const request = requests.find(r => r.id == req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
});

// Update request
app.put('/requests/:id', authenticate, (req, res) => {
    const request = requests.find(r => r.id == req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    Object.assign(request, req.body);
    res.json(request);
});

// Cancel request
app.put('/requests/:id/cancel', authenticate, (req, res) => {
    const request = requests.find(r => r.id == req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    request.status = 'cancelled';
    res.json(request);
});

// Fulfill request
app.put('/requests/:id/fulfill', authenticate, (req, res) => {
    const request = requests.find(r => r.id == req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    request.status = 'fulfilled';
    res.json(request);
});

const PORT = process.env.PORT || 30004;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Request Service running on port ${PORT}`));
}
module.exports = app;
