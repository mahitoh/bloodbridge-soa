const router = require('express').Router();
const { findNearbyDonors, getDistance } = require('../controllers/location.controller');
const { validateNearby, validateDistance } = require('../validators/location.validator');

router.post('/nearby', validateNearby, findNearbyDonors);
router.post('/distance', validateDistance, getDistance);

module.exports = router;
