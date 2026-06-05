const pool = require('../config/db');

const listHospitals = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT id, name, email, phone, city, address, latitude, longitude, created_at FROM hospitals ORDER BY name ASC');
        res.json({ hospitals: result.rows });
    } catch (error) {
        next(error);
    }
};

const getHospital = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, name, email, phone, city, address, latitude, longitude, created_at FROM hospitals WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        res.json({ hospital: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

const createHospital = async (req, res, next) => {
    try {
        const { name, email, phone, city, address, latitude, longitude } = req.body;
        
        const result = await pool.query(
            `INSERT INTO hospitals (name, email, phone, city, address, latitude, longitude) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, name, email, phone, city, address, latitude, longitude, created_at`,
            [name, email, phone, city, address, latitude, longitude]
        );

        res.status(201).json({ message: 'Hospital created', hospital: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

const updateHospital = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone, city, address, latitude, longitude } = req.body;

        const result = await pool.query(
            `UPDATE hospitals 
             SET name = COALESCE($1, name), 
                 email = COALESCE($2, email), 
                 phone = COALESCE($3, phone), 
                 city = COALESCE($4, city), 
                 address = COALESCE($5, address), 
                 latitude = COALESCE($6, latitude), 
                 longitude = COALESCE($7, longitude) 
             WHERE id = $8 
             RETURNING id, name, email, phone, city, address, latitude, longitude, created_at`,
            [name, email, phone, city, address, latitude, longitude, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        res.json({ message: 'Hospital updated', hospital: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

const getMyHospital = async (req, res, next) => {
    try {
        const email = req.user?.email;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });

        const result = await pool.query(
            'SELECT id, name, email, phone, city, address, latitude, longitude, created_at FROM hospitals WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hospital profile not found' });
        }

        res.json({ hospital: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = { listHospitals, getHospital, createHospital, updateHospital, getMyHospital };
