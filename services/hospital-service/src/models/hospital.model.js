const pool = require('../config/db');

const getHospitalById = async (hospitalId) => {
    const result = await pool.query('SELECT id, name, email, phone, city, address, latitude, longitude, created_at FROM hospitals WHERE id = $1', [hospitalId]);
    return result.rows[0] || null;
};

module.exports = { getHospitalById };
