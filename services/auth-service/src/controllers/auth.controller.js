const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];

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
    bloodType: user.bloodType,
    phone: user.phone,
    city: user.city
});

const register = async (req, res, next) => {
    try {
        const existing = users.find((user) => user.email === req.body.email);
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        const user = {
            id: `user_${Date.now()}`,
            ...req.body,
            password: await bcrypt.hash(req.body.password, 12),
            createdAt: new Date().toISOString()
        };
        users.push(user);

        res.status(201).json({ message: 'User registered', token: signToken(user), user: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = users.find((item) => item.email === req.body.email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        res.json({ message: 'Login successful', token: signToken(user), user: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

const verify = (req, res) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET || 'dev-secret');
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
};

module.exports = { register, login, verify, users };
