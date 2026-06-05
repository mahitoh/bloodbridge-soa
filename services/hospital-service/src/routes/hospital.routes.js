const router = require('express').Router();
const { listHospitals, getHospital, createHospital, updateHospital, getMyHospital } = require('../controllers/hospital.controller');
const { validateHospital } = require('../validators/hospital.validator');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, validateHospital, createHospital);
router.put('/:id', verifyToken, validateHospital, updateHospital);

router.get('/', listHospitals);
router.get('/:id', getHospital);
router.get('/me', verifyToken, getMyHospital);

module.exports = router;
