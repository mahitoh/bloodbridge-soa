const router = require('express').Router();
const { listRequests, getRequest, createRequest, updateStatus } = require('../controllers/request.controller');
const { validateRequest, validateStatus } = require('../validators/request.validator');

router.get('/', listRequests);
router.post('/', validateRequest, createRequest);
router.get('/:id', getRequest);
router.put('/:id/status', validateStatus, updateStatus);

module.exports = router;
