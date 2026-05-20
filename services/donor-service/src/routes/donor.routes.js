const router = require('express').Router();
const { listDonors, getDonor, createDonor, updateAvailability } = require('../controllers/donor.controller');
const { validateDonor, validateAvailability } = require('../validators/donor.validator');

router.get('/', listDonors);
router.post('/', validateDonor, createDonor);
router.get('/:id', getDonor);
router.put('/:id/availability', validateAvailability, updateAvailability);

module.exports = router;
