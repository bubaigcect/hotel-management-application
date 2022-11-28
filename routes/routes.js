const express = require('express');
const router = express.Router();
const userController = require('../mediators/userMediators');

// Login
router.post('/login', userController.loginWithPassword);

module.exports = router;