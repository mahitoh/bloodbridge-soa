const router = require('express').Router();
const { sendDonorNotification, sendHospitalNotification } = require('../controllers/notification.controller');
const { validateDonorNotification, validateHospitalNotification } = require('../validators/notification.validator');

router.post('/donor', validateDonorNotification, sendDonorNotification);
router.post('/hospital', validateHospitalNotification, sendHospitalNotification);

module.exports = router;
