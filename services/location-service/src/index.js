require('dotenv').config({ path: '../../.env' }); // Adjust path as needed

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const donors = []; // Shared? But for demo, mock
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
    res.json({ status: 'healthy', service: 'location-service' });
});

// Find nearby donors
app.post('/location/nearby', authenticate, (req, res) => {
    const { lat, lng, bloodType, radius } = req.body;
    if (!lat || !lng || !bloodType || !radius) {
        return res.status(400).json({ error: 'Lat, lng, bloodType, and radius are required' });
    }
    // Mock: return donors within radius (in km), for demo
    const nearby = donors.filter(d => d.bloodType === bloodType && d.available && Math.random() * 10 < radius); // Mock distance
    res.json(nearby);
});

// Get distance
app.get('/location/distance', authenticate, (req, res) => {
    const { lat1, lng1, lat2, lng2 } = req.query;
    if (!lat1 || !lng1 || !lat2 || !lng2) {
        return res.status(400).json({ error: 'All lat/lng required' });
    }
    // Mock distance calculation (in km)
    const distance = Math.sqrt((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2) * 111; // Rough approx
    res.json({ distance: Math.round(distance * 100) / 100 });
});

const PORT = process.env.PORT || 30005;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Location Service running on port ${PORT}`));
}
module.exports = app;
