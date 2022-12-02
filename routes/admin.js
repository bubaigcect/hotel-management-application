// Dependencies
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Common Files
const userMediators = require('../mediators/userMediators');
const commonMediators = require('../mediators/commonMediators');

// Use middleware to check authentication
router.use(userMediators.verifyToken);

// Add permission
router.post('/add-permission', /*commonMediators.verifyAccess, */ userMediators.addPermission);
// router.get('/get-permission-details/:id', userMediators.getPermissionDetails);
router.patch('/update-permission/:id', userMediators.updatePermission);
router.delete('/delete-permission/:id', userMediators.deletePermission);
// Add role
router.post('/add-role', userMediators.addRole);
router.patch('/update-role/:id', userMediators.updateRole);
router.delete('/delete-role/:id', userMediators.deleteRole);
// Add user
router.post('/add-user', userMediators.addUser);
router.get('/get-user-details/:id', userMediators.getUserDetails);
router.delete('/delete-user/:id', userMediators.deleteRole);

module.exports = router;