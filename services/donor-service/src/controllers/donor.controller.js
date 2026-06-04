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
        const { name, blood_type, phone, city, latitude, longitude, available } = req.body;
        
        const result = await pool.query(
            `INSERT INTO donors (name, blood_type, phone, city, latitude, longitude, available) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, name, blood_type, phone, city, latitude, longitude, available, created_at`,
            [name, blood_type, phone, city, latitude, longitude, available !== undefined ? available : true]
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
        
        // Update cache
        await redis.set(`donor:${id}`, JSON.stringify(donor), 'EX', 3600);
        await redis.del('donors:list'); // Invalidate list cache
        
        res.json({ message: 'Availability updated', donor });
    } catch (error) {
        next(error);
    }
};

module.exports = { listDonors, getDonor, createDonor, updateAvailability };
