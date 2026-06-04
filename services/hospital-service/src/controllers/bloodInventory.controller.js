const bloodInventoryModel = require('../models/bloodInventory.model');
const hospitalModel = require('../models/hospital.model');
const { updateHospitalMetrics } = require('../metrics');

const getHospitalBloodInventory = async (req, res, next) => {
    try {
        const { hospitalId } = req.params;
        
        // Verify hospital exists and belongs to user (if applicable)
        const hospital = await hospitalModel.getHospitalById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }
        
        // Check authorization (user must be from this hospital or admin)
        // For now, we'll allow access if hospital exists - auth middleware should handle user validation
        
        const inventory = await bloodInventoryModel.getBloodInventoryByHospitalId(hospitalId);
        res.json({ inventory });
    } catch (error) {
        next(error);
    }
};

const updateBloodInventoryLevels = async (req, res, next) => {
    try {
        const { hospitalId, bloodType } = req.params;
        const { unitsAvailable, unitsReserved } = req.body;
        
        // Validate input
        if (unitsAvailable < 0 || unitsReserved < 0) {
            return res.status(400).json({ error: 'Unit values cannot be negative' });
        }
        
        const inventory = await bloodInventoryModel.updateBloodInventory(
            hospitalId, 
            bloodType, 
            unitsAvailable, 
            unitsReserved
        );
        
        res.json({ 
            message: 'Blood inventory updated successfully', 
            inventory 
        });
    } catch (error) {
        next(error);
    }
};

const reserveBloodForRequest = async (req, res, next) => {
    try {
        const { hospitalId, bloodType } = req.params;
        const { units } = req.body;
        
        if (!units || units <= 0) {
            return res.status(400).json({ error: 'Valid units required' });
        }
        
        const inventory = await bloodInventoryModel.reserveBloodUnits(
            hospitalId, 
            bloodType, 
            units
        );
        
        res.json({ 
            message: `Reserved ${units} units of ${bloodType} blood`, 
            inventory 
        });
    } catch (error) {
        if (error.message === 'Insufficient blood units available') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

const releaseBloodReservation = async (req, res, next) => {
    try {
        const { hospitalId, bloodType } = req.params;
        const { units } = req.body;
        
        if (!units || units <= 0) {
            return res.status(400).json({ error: 'Valid units required' });
        }
        
        const inventory = await bloodInventoryModel.releaseBloodUnits(
            hospitalId, 
            bloodType, 
            units
        );
        
        res.json({ 
            message: `Released ${units} units of ${bloodType} blood from reservation`, 
            inventory 
        });
    } catch (error) {
        if (error.message === 'Cannot release more units than reserved') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

const consumeBloodFromInventory = async (req, res, next) => {
    try {
        const { hospitalId, bloodType } = req.params;
        const { units } = req.body;
        
        if (!units || units <= 0) {
            return res.status(400).json({ error: 'Valid units required' });
        }
        
        const inventory = await bloodInventoryModel.consumeBloodUnits(
            hospitalId, 
            bloodType, 
            units
        );
        
        res.json({ 
            message: `Consumed ${units} units of ${bloodType} blood`, 
            inventory 
        });
    } catch (error) {
        if (error.message === 'Insufficient reserved units to consume') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

module.exports = {
    getHospitalBloodInventory,
    updateBloodInventoryLevels,
    reserveBloodForRequest,
    releaseBloodReservation,
    consumeBloodFromInventory
};
