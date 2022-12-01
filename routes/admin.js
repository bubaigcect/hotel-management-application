// Dependencies
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Common Files
const userMediators = require('../mediators/userMediators');

// Use middleware to check authentication
router.use(userMediators.verifyToken);

// Add permission
router.post('/add-permission', userMediators.addPermission);
// router.patch('/update-permission', userMediators.updatePermission);
router.delete('/delete-permission/:id', userMediators.deletePermission);
// Add role
router.post('/add-role', userMediators.addRole);
// Add user
router.post('/add-user', userMediators.addUser);

module.exports = router;