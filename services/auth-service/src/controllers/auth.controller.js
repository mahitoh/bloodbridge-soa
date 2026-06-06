const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signToken = (user) => jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '24h' }
);

const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bloodType: user.bloodtype,
    phone: user.phone,
    city: user.city
});

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, bloodType, phone, city } = req.body;
        
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role, bloodtype, phone, city) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, name, email, role, bloodtype, phone, city`,
            [name, email, hashedPassword, role, bloodType || null, phone || null, city || null]
        );

        const user = result.rows[0];

        res.status(201).json({ 
            message: 'User registered', 
            token: signToken(user), 
            user: sanitizeUser(user) 
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ 
            message: 'Login successful', 
            token: signToken(user), 
            refreshToken: signToken({ id: user.id, email: user.email, role: user.role, type: 'refresh' }),
            user: sanitizeUser(user) 
        });
    } catch (error) {
        next(error);
    }
};

const verify = async (req, res) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET || 'dev-secret');
        const result = await pool.query(
            'SELECT id, name, email, role, bloodtype, phone, city FROM users WHERE id = $1',
            [decoded.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ valid: false, error: 'User not found' });
        }
        res.json({ valid: true, user: sanitizeUser(result.rows[0]) });
    } catch (error) {
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: refresh } = req.body;
        if (!refresh) return res.status(401).json({ error: 'Refresh token required' });

        const decoded = jwt.verify(refresh, process.env.JWT_SECRET || 'dev-secret');
        const result = await pool.query(
            'SELECT id, name, email, role, bloodtype, phone, city FROM users WHERE id = $1',
            [decoded.id]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            token: signToken(user),
            refreshToken: signToken({ id: user.id, email: user.email, role: user.role, type: 'refresh' }),
            user: sanitizeUser(user)
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

module.exports = { register, login, verify, refreshToken };
