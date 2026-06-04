const pool = require('../config/db');
const redis = require('../config/redis');

// Haversine formula to calculate distance in km
const HAVERSINE_QUERY = `
    SELECT id, name, blood_type, phone, city, latitude, longitude, available,
    (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) AS distance
    FROM donors
    WHERE available = true
    HAVING (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) <= $3
    ORDER BY distance ASC
`;

const findNearbyDonors = async (req, res, next) => {
    try {
        const { latitude, longitude, radius, blood_type } = req.body;
        const cacheKey = `nearby:${latitude}:${longitude}:${radius}:${blood_type || 'all'}`;

        // Try cache first (valid for 60 seconds)
        const cached = await redis.get(cacheKey);
        if (cached) {
            return res.json({ donors: JSON.parse(cached), source: 'cache' });
        }

        let query = HAVERSINE_QUERY;
        const params = [latitude, longitude, radius];
        let paramCount = 4;

        if (blood_type) {
            query += ` AND blood_type = $${paramCount}`;
            params.push(blood_type);
        }

        const result = await pool.query(query, params);
        
        // Cache the result
        await redis.set(cacheKey, JSON.stringify(result.rows), 'EX', 60);

        res.json({ donors: result.rows, source: 'database' });
    } catch (error) {
        next(error);
    }
};

const getDistance = async (req, res, next) => {
    try {
        const { lat1, lon1, lat2, lon2 } = req.body;
        
        const result = await pool.query(`
            SELECT (6371 * acos(cos(radians($1)) * cos(radians($3)) * cos(radians($4) - radians($2)) + sin(radians($1)) * sin(radians($3)))) AS distance
        `, [lat1, lon1, lat2, lon2]);

        res.json({ distance_km: parseFloat(result.rows[0].distance).toFixed(2) });
    } catch (error) {
        next(error);
    }
};

module.exports = { findNearbyDonors, getDistance };
