const router = require('express').Router();
const { listHospitals, getHospital, createHospital, updateHospital } = require('../controllers/hospital.controller');
const { validateHospital } = require('../validators/hospital.validator');

router.get('/', listHospitals);
router.post('/', validateHospital, createHospital);
router.get('/:id', getHospital);
router.put('/:id', validateHospital, updateHospital);

module.exports = router;
