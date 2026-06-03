const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const requireRole = (role) => (req, res, next) => {
    if (req.user?.role !== role) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

module.exports = { verifyToken, requireRole };
