const router = require('express').Router();
const { listRequests, getRequest, createRequest, updateStatus, acceptRequest } = require('../controllers/request.controller');
const { validateRequest, validateStatus } = require('../validators/request.validator');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', listRequests);
router.get('/:id', getRequest);

router.post('/', verifyToken, validateRequest, createRequest);
router.put('/:id/status', verifyToken, validateStatus, updateStatus);
router.post('/:id/accept', verifyToken, acceptRequest);

module.exports = router;
