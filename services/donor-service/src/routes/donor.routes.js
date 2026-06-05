const router = require('express').Router();
const { listDonors, getDonor, createDonor, updateAvailability, updateDonor, getDonorHistory } = require('../controllers/donor.controller');
const { validateDonor, validateAvailability } = require('../validators/donor.validator');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', listDonors);
router.get('/:id', getDonor);
router.get('/:id/history', getDonorHistory);

router.post('/', verifyToken, validateDonor, createDonor);
router.put('/:id/availability', verifyToken, validateAvailability, updateAvailability);
router.put('/:id', verifyToken, updateDonor);

module.exports = router;
