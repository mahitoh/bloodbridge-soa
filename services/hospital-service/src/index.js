require('dotenv').config({ path: '../../.env' }); // Adjust path as needed

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const hospitals = []; // In-memory storage for demo

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
    res.json({ status: 'healthy', service: 'hospital-service' });
});

// Create hospital
app.post('/hospitals', authenticate, (req, res) => {
    const { name, email, phone, address, city, registrationNumber } = req.body;
    if (!name || !email || !phone || !address || !city || !registrationNumber) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const hospital = {
        id: hospitals.length + 1,
        name,
        email,
        phone,
        address,
        city,
        registrationNumber,
        beds: 0
    };
    hospitals.push(hospital);
    res.status(201).json(hospital);
});

// Get hospital by ID
app.get('/hospitals/:id', authenticate, (req, res) => {
    const hospital = hospitals.find(h => h.id == req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
});

// Update hospital
app.put('/hospitals/:id', authenticate, (req, res) => {
    const hospital = hospitals.find(h => h.id == req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    Object.assign(hospital, req.body);
    res.json(hospital);
});

// Update beds
app.put('/hospitals/:id/beds', authenticate, (req, res) => {
    const hospital = hospitals.find(h => h.id == req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    hospital.beds = req.body.beds;
    res.json(hospital);
});

const PORT = process.env.PORT || 30003;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Hospital Service running on port ${PORT}`));
}
module.exports = app;
