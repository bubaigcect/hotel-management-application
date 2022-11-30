// Dependencies
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Common Files
const userMediators = require('../mediators/userMediators');

// Login
router.post('/login', userMediators.loginWithPassword);

// use middleware to check authentication
router.use(userMediators.verifyToken);

router.post('/add-user', userMediators.addUser);

module.exports = router;