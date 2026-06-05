const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        const result = await pool.query('SELECT id, name, email, role, bloodtype, phone, city FROM users WHERE id = $1', [decoded.id]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = result.rows[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { verifyToken };
