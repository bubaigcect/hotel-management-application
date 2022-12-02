// Dependencies
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Common Files
const commonController = require("../controllers/commonController");
const apiMessages = require("../config/apiMessages");
const userController = require("../controllers/userController");

const userMediator = {};

// For Login
userMediator.loginWithPassword = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        if (
            values.emailID != null
            && values.password != null
        ) {
            await commonController.commonEmailValidation(values.emailID);
            let userData = await userController.validateEmailExist(values);
            let result = await userController.loginWithPassword(values, userData);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

// For Verify Token
userMediator.verifyToken = async (req, res, next) => {
    try{
        if(req.headers.authorization) {
            const accessToken = req.headers.authorization.split(" ")[1];
            console.log("Verify Token entered", accessToken);
            req.userData = await jwt.verify(accessToken, process.env.JWT_SECRET);
            next();
        } else {
            throw { success: false, extras: {code: apiMessages.TOKEN_REQUIRED.code, msg: apiMessages.TOKEN_REQUIRED.description } }; 
        }
    } catch (error) {
        console.log(error.name, error.message);
        let errorResponse = { success: false, extras: { code: apiMessages.SERVER_ERROR.code, msg: apiMessages.SERVER_ERROR.description } };
        if(error.name == "TokenExpiredError") {
            errorResponse = { success: false, extras: {code: apiMessages.TOKEN_EXPIRED.code, msg: apiMessages.TOKEN_EXPIRED.description } }; 
        }
        else if(error.name == "JsonWebTokenError") {
            errorResponse = { success: false, extras: {code: apiMessages.JWT_MALFORMED.code, msg: apiMessages.JWT_MALFORMED.description } }; 
        }
        await commonController.commonResponseHandler(res, errorResponse);
    }
}

// For User
userMediator.addUser = async (req, res) => {
    try{
        let values = JSON.parse(JSON.stringify(req.body));
        if(
            values.name != null &&
            values.emailID != null &&
            values.gender != null &&
            values.password != null
        ) {
            await userController.checkWhetherEmailIDAlreadyExist(values);
            if(values.roleID) await userController.checkWhetherRoleAlreadyExist(values.roleID);
            if(values.phoneNumber) await commonController.commonPhoneNumberValidation(values.phoneNumber);
            await commonController.commonPasswordValidation(values.password);
            values.userID = req.userData.userID;
            // Now adding type admin static, later we can deside what we can do.
            values.type = "admin";
            let result = await userController.addUser(values);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

userMediator.getUserDetails = async (req, res) => {
    try{
        if(req.params.id) {
            let userID = req.params.id;
            let result = await userController.getUserDetails(userID);
            await commonController.commonResponseHandler(res, result); 
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

// For Permission
userMediator.addPermission = async (req, res) => {
    try{
        let values = JSON.parse(JSON.stringify(req.body));
        if(values.name != null) {
            await userController.checkWhetherPermissionAlreadyExist(values);
            values.userID = req.userData.userID;
            let result = await userController.addPermission(values);
            await commonController.commonResponseHandler(res, result); 
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

userMediator.updatePermission = async (req, res) => {
    try{
        let values = JSON.parse(JSON.stringify(req.body));
        if(req.params.id != null) {
            let permissionID = req.params.id;
            let updateData = {
                updatedBy: req.userData.userID,
                ...values
            };
            await userController.checkWhetherPermissionIDValid(permissionID);
            if(values.name) await userController.checkWhetherPermissionAlreadyExist(values, permissionID);
            let result = await userController.updatePermissionData(permissionID, updateData);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch(error) {
        await commonController.commonResponseHandler(res, error);
    }
}

userMediator.deletePermission = async (req, res) => {
    try{
        if(req.params.id) {
            let permissionID = req.params.id;
            let updateData = {
                updatedBy: req.userData.userID,
                status: false,
            };
            await userController.checkWhetherPermissionIDValid(permissionID);
            let result = await userController.updatePermissionData(permissionID, updateData);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch(error) {
        await commonController.commonResponseHandler(res, error);
    }
}

// For Role
userMediator.addRole = async (req, res) => {
    try{
        let values = JSON.parse(JSON.stringify(req.body));
        if(
            values.name != null &&
            values.permissions != null
        ) {
            await commonController.commonPermissionIDValidation(values);
            await userController.checkWhetherPermissionIDValid(values.permissions);
            await userController.checkWhetherRoleAlreadyExist(values);
            values.userID = req.userData.userID;
            let result = await userController.addRole(values);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

userMediator.updateRole = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        if(req.params.id != null) {
            let roleID = req.params.id;
            let updateData = {
                updatedBy: req.userData.userID,
                ...values
            };
            await userController.checkWhetherRoleIDValid(roleID);
            if(values.name) await userController.checkWhetherRoleAlreadyExist(values, roleID);
            if(values.permissions) await commonController.commonPermissionIDValidation(values);
            let result = await userController.updateRoleData(roleID, updateData);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

userMediator.deleteRole = async (req, res) => {
    try{
        if(req.params.id) {
            let roleID = req.params.id;
            let updateData = {
                updatedBy: req.userData.userID,
                status: false,
            };
            await userController.checkWhetherRoleIDValid(roleID);
            let result = await userController.updateRoleData(roleID, updateData);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

module.exports = userMediator;