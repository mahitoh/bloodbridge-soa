const pool = require('../config/db');
const redis = require('../config/redis');

const listDonors = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT id, name, blood_type, phone, city, latitude, longitude, available, created_at FROM donors ORDER BY created_at DESC');
        res.json({ donors: result.rows });
    } catch (error) {
        next(error);
    }
};

const getDonor = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Try cache first
        const cached = await redis.get(`donor:${id}`);
        if (cached) {
            return res.json({ donor: JSON.parse(cached), source: 'cache' });
        }

        // Fallback to DB
        const result = await pool.query('SELECT id, name, blood_type, phone, city, latitude, longitude, available, created_at FROM donors WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        const donor = result.rows[0];
        // Cache for 1 hour
        await redis.set(`donor:${id}`, JSON.stringify(donor), 'EX', 3600);
        
        res.json({ donor, source: 'database' });
    } catch (error) {
        next(error);
    }
};

const createDonor = async (req, res, next) => {
    try {
        const { name, blood_type, phone, city, latitude, longitude, available, email } = req.body;
        
        const result = await pool.query(
            `INSERT INTO donors (name, blood_type, phone, city, latitude, longitude, available, email) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id, name, blood_type, phone, city, latitude, longitude, available, created_at`,
            [name, blood_type, phone, city, latitude, longitude, available !== undefined ? available : true, email]
        );

        const donor = result.rows[0];
        
        // Invalidate list cache and set individual cache
        await redis.del('donors:list');
        await redis.set(`donor:${donor.id}`, JSON.stringify(donor), 'EX', 3600);
        
        res.status(201).json({ message: 'Donor created', donor });
    } catch (error) {
        next(error);
    }
};

const updateAvailability = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { available } = req.body;

        const result = await pool.query(
            'UPDATE donors SET available = $1 WHERE id = $2 RETURNING id, name, blood_type, phone, city, latitude, longitude, available, created_at',
            [available, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        const donor = result.rows[0];

        await redis.set(`donor:${id}`, JSON.stringify(donor), 'EX', 3600);
        await redis.del('donors:list');

        res.json({ message: 'Availability updated', donor });
    } catch (error) {
        next(error);
    }
};

const updateDonor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, blood_type, phone, city } = req.body;

        const result = await pool.query(
            `UPDATE donors 
             SET name = COALESCE($1, name), 
                 blood_type = COALESCE($2, blood_type), 
                 phone = COALESCE($3, phone), 
                 city = COALESCE($4, city) 
             WHERE id = $5 
             RETURNING id, name, blood_type, phone, city, latitude, longitude, available, created_at`,
            [name, blood_type, phone, city, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        const donor = result.rows[0];

        await redis.set(`donor:${id}`, JSON.stringify(donor), 'EX', 3600);
        await redis.del('donors:list');

        res.json({ message: 'Profile updated', donor });
    } catch (error) {
        next(error);
    }
};

const getDonorHistory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const historyResult = await pool.query(
            `SELECT r.id, r.blood_type, r.units, r.urgency, r.status, r.notes, r.created_at,
                    h.name as hospital_name, h.city as hospital_city
             FROM requests r
             JOIN hospitals h ON r.hospital_id = h.id
             WHERE r.accepted_by_donor_id = $1
             ORDER BY r.created_at DESC`,
            [id]
        );

        const history = historyResult.rows.map(row => {
            const dt = new Date(row.created_at)
            return {
                id: row.id,
                hospital: row.hospital_name,
                bloodType: row.blood_type,
                units: row.units,
                urgency: row.urgency,
                status: row.status,
                notes: row.notes || '',
                date: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            }
        })

        res.json({ history });
    } catch (error) {
        next(error);
    }
};

const getDonorByEmail = async (req, res, next) => {
    try {
        const email = req.user?.email;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });

        const result = await pool.query(
            'SELECT id, name, blood_type, phone, city, latitude, longitude, available, created_at FROM donors WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Donor profile not found' });
        }

        res.json({ donor: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = { listDonors, getDonor, createDonor, updateAvailability, updateDonor, getDonorHistory, getDonorByEmail };
