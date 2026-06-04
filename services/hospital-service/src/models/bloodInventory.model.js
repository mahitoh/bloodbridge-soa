const pool = require('../config/db');

const getBloodInventoryByHospitalId = async (hospitalId) => {
    const result = await pool.query('SELECT blood_type, units_available, units_reserved FROM blood_inventory WHERE hospital_id = $1', [hospitalId]);
    return result.rows;
};

const updateBloodInventory = async (hospitalId, bloodType, unitsAvailable, unitsReserved) => {
    const result = await pool.query(
        `INSERT INTO blood_inventory (hospital_id, blood_type, units_available, units_reserved) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (hospital_id, blood_type) 
         DO UPDATE SET units_available = $3, units_reserved = $4 
         RETURNING *`,
        [hospitalId, bloodType, unitsAvailable, unitsReserved]
    );
    return result.rows[0];
};

const reserveBloodUnits = async (hospitalId, bloodType, units) => {
    const result = await pool.query(
        `UPDATE blood_inventory 
         SET units_reserved = units_reserved + $3, units_available = units_available - $3 
         WHERE hospital_id = $1 AND blood_type = $2 AND units_available >= $3 
         RETURNING *`,
        [hospitalId, bloodType, units]
    );
    if (result.rows.length === 0) {
        throw new Error('Insufficient blood units available');
    }
    return result.rows[0];
};

const releaseBloodUnits = async (hospitalId, bloodType, units) => {
    const result = await pool.query(
        `UPDATE blood_inventory 
         SET units_reserved = units_reserved - $3, units_available = units_available + $3 
         WHERE hospital_id = $1 AND blood_type = $2 AND units_reserved >= $3 
         RETURNING *`,
        [hospitalId, bloodType, units]
    );
    if (result.rows.length === 0) {
        throw new Error('Cannot release more units than reserved');
    }
    return result.rows[0];
};

const consumeBloodUnits = async (hospitalId, bloodType, units) => {
    const result = await pool.query(
        `UPDATE blood_inventory 
         SET units_reserved = units_reserved - $3, units_available = units_available - $3 
         WHERE hospital_id = $1 AND blood_type = $2 AND units_reserved >= $3 
         RETURNING *`,
        [hospitalId, bloodType, units]
    );
    if (result.rows.length === 0) {
        throw new Error('Insufficient reserved units to consume');
    }
    return result.rows[0];
};

module.exports = { 
    getBloodInventoryByHospitalId, 
    updateBloodInventory, 
    reserveBloodUnits, 
    releaseBloodUnits, 
    consumeBloodUnits 
};
