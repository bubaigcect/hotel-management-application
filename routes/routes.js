// Dependencies
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Common Files
const userMediators = require('../mediators/userMediators');
const adminRouter = require('../routes/admin');


// Login
router.post('/login', userMediators.loginWithPassword);

// Admin Api's
router.use('/admin', adminRouter);

module.exports = router;