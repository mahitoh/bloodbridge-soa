const { Pool } = require('pg');
const pool = require('../config/db');

const createBloodInventoryTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS blood_inventory (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
                blood_type VARCHAR(5) NOT NULL,
                units_available INTEGER DEFAULT 0,
                units_reserved INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(hospital_id, blood_type)
            )
        `);
    } catch (error) {
        throw new Error(`Failed to create blood inventory table: ${error.message}`);
    }
};

const initializeHospitalInventory = async (hospitalId) => {
    try {
        const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
        for (const type of bloodTypes) {
            await pool.query(`
                INSERT INTO blood_inventory (hospital_id, blood_type, units_available, units_reserved)
                VALUES ($1, $2, 0, 0)
                ON CONFLICT (hospital_id, blood_type) DO NOTHING
            `, [hospitalId, type]);
        }
    } catch (error) {
        throw new Error(`Failed to initialize hospital inventory: ${error.message}`);
    }
};

const getBloodInventoryByHospitalId = async (hospitalId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM blood_inventory WHERE hospital_id = $1 ORDER BY blood_type',
            [hospitalId]
        );
        return result.rows;
    } catch (error) {
        throw new Error(`Failed to fetch blood inventory: ${error.message}`);
    }
};

const getBloodInventoryByHospitalAndType = async (hospitalId, bloodType) => {
    try {
        const result = await pool.query(
            'SELECT * FROM blood_inventory WHERE hospital_id = $1 AND blood_type = $2',
            [hospitalId, bloodType]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Failed to fetch blood inventory: ${error.message}`);
    }
};

const updateBloodInventory = async (hospitalId, bloodType, unitsAvailable, unitsReserved) => {
    try {
        const result = await pool.query(
            `UPDATE blood_inventory 
             SET units_available = $1, units_reserved = $2, last_updated = CURRENT_TIMESTAMP
             WHERE hospital_id = $3 AND blood_type = $4
             RETURNING *`,
            [unitsAvailable, unitsReserved, hospitalId, bloodType]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Failed to update blood inventory: ${error.message}`);
    }
};

const reserveBloodUnits = async (hospitalId, bloodType, units) => {
    try {
        const inventory = await getBloodInventoryByHospitalAndType(hospitalId, bloodType);
        if (!inventory) {
            throw new Error('Blood type not found for hospital');
        }
        
        if (inventory.units_available < units) {
            throw new Error('Insufficient blood units available');
        }
        
        const newAvailable = inventory.units_available - units;
        const newReserved = inventory.units_reserved + units;
        
        return await updateBloodInventory(hospitalId, bloodType, newAvailable, newReserved);
    } catch (error) {
        throw new Error(`Failed to reserve blood units: ${error.message}`);
    }
};

const releaseBloodUnits = async (hospitalId, bloodType, units) => {
    try {
        const inventory = await getBloodInventoryByHospitalAndType(hospitalId, bloodType);
        if (!inventory) {
            throw new Error('Blood type not found for hospital');
        }
        
        if (inventory.units_reserved < units) {
            throw new Error('Cannot release more units than reserved');
        }
        
        const newAvailable = inventory.units_available + units;
        const newReserved = inventory.units_reserved - units;
        
        return await updateBloodInventory(hospitalId, bloodType, newAvailable, newReserved);
    } catch (error) {
        throw new Error(`Failed to release blood units: ${error.message}`);
    }
};

const consumeBloodUnits = async (hospitalId, bloodType, units) => {
    try {
        const inventory = await getBloodInventoryByHospitalAndType(hospitalId, bloodType);
        if (!inventory) {
            throw new Error('Blood type not found for hospital');
        }
        
        if (inventory.units_reserved < units) {
            throw new Error('Insufficient reserved units to consume');
        }
        
        const newReserved = inventory.units_reserved - units;
        
        return await updateBloodInventory(hospitalId, bloodType, inventory.units_available, newReserved);
    } catch (error) {
        throw new Error(`Failed to consume blood units: ${error.message}`);
    }
};

module.exports = {
    createBloodInventoryTable,
    initializeHospitalInventory,
    getBloodInventoryByHospitalId,
    getBloodInventoryByHospitalAndType,
    updateBloodInventory,
    reserveBloodUnits,
    releaseBloodUnits,
    consumeBloodUnits
};
