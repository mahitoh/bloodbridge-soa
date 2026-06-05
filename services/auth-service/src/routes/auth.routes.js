const router = require('express').Router();
const { register, login, verify, refreshToken } = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateVerify } = require('../validators/auth.validator');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/verify', validateVerify, verify);
router.post('/refresh', refreshToken);

module.exports = router;
