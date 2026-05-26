const router = require('express').Router();
const {
    sendSmsNotification,
    sendEmailNotification,
    getNotificationHistory,
    getNotificationById
} = require('../controllers/notification.controller');
const {
    validateSmsNotification,
    validateEmailNotification,
    validateDonorNotification,
    validateHospitalNotification
} = require('../validators/notification.validator');

router.post('/sms', validateSmsNotification, sendSmsNotification);
router.post('/email', validateEmailNotification, sendEmailNotification);
router.get('/history', getNotificationHistory);
router.get('/history/:id', getNotificationById);

router.post('/donor', validateDonorNotification, sendSmsNotification);
router.post('/hospital', validateHospitalNotification, sendEmailNotification);

module.exports = router;
