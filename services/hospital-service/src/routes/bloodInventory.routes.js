const router = require('express').Router();
const { 
    getHospitalBloodInventory, 
    updateBloodInventoryLevels,
    reserveBloodForRequest,
    releaseBloodReservation,
    consumeBloodFromInventory
} = require('../controllers/bloodInventory.controller');
const { validateHospitalId, validateBloodType, validateInventoryUpdate } = require('../validators/bloodInventory.validator');

// Get hospital blood inventory
router.get('/:hospitalId/inventory', validateHospitalId, getHospitalBloodInventory);

// Update blood inventory levels
router.put('/:hospitalId/inventory/:bloodType', 
    validateHospitalId, 
    validateBloodType, 
    validateInventoryUpdate, 
    updateBloodInventoryLevels
);

// Reserve blood for request
router.post('/:hospitalId/inventory/:bloodType/reserve', 
    validateHospitalId, 
    validateBloodType, 
    reserveBloodForRequest
);

// Release blood reservation
router.post('/:hospitalId/inventory/:bloodType/release', 
    validateHospitalId, 
    validateBloodType, 
    releaseBloodReservation
);

// Consume blood from inventory
router.post('/:hospitalId/inventory/:bloodType/consume', 
    validateHospitalId, 
    validateBloodType, 
    consumeBloodFromInventory
);

module.exports = router;
