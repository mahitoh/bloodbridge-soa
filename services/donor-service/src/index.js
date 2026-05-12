require('dotenv').config({ path: '../../.env' }); // Adjust path as needed

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const donors = []; // In-memory storage for demo

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
    res.json({ status: 'healthy', service: 'donor-service' });
});

// Create donor
app.post('/donors', authenticate, (req, res) => {
    const { name, email, bloodType, location, phone } = req.body;
    if (!name || !email || !bloodType) {
        return res.status(400).json({ error: 'Name, email, and bloodType are required' });
    }
    const donor = {
        id: donors.length + 1,
        name,
        email,
        bloodType,
        location,
        phone,
        available: true,
        history: []
    };
    donors.push(donor);
    res.status(201).json(donor);
});

// Get donor by ID
app.get('/donors/:id', authenticate, (req, res) => {
    const donor = donors.find(d => d.id == req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.json(donor);
});

// Update donor
app.put('/donors/:id', authenticate, (req, res) => {
    const donor = donors.find(d => d.id == req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    Object.assign(donor, req.body);
    res.json(donor);
});

// Toggle availability
app.put('/donors/:id/availability', authenticate, (req, res) => {
    const donor = donors.find(d => d.id == req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    donor.available = req.body.available;
    res.json(donor);
});

// Get donors by blood type
app.get('/donors/blood/:type', authenticate, (req, res) => {
    const filtered = donors.filter(d => d.bloodType === req.params.type);
    res.json(filtered);
});

// Get donation history
app.get('/donors/:id/history', authenticate, (req, res) => {
    const donor = donors.find(d => d.id == req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.json(donor.history);
});

const PORT = process.env.PORT || 30002;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Donor Service running on port ${PORT}`));
}
module.exports = app;
