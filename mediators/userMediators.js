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

// For Add New User
userMediator.addUser = async (req, res) => {
    console.log(req.userData)
    try{
        const userData = req.userData;
        let response = { success: false, extras: { code: apiMessages.SERVER_ERROR.code, msg: apiMessages.SERVER_ERROR.description } };
        await commonController.commonResponseHandler(res, response);
    } catch (error) {
        await commonController.commonErrorHandler(res, error);
    }
}

module.exports = userMediator;