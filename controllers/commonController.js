// Dependencies
require('dotenv').config();
const validator = require("validator");

// Common Files
const apiMessages = require('../config/apiMessages');
const logger = require("../utils/logger");

const commonController = {};

// Common Response Handler
commonController.commonResponseHandler = (res, result) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(result.success) {
                if(!res.headerSent) {
                    logger.info(JSON.stringify(result));
                    resolve(res.status(200).json(result));
                }
                else {
                    resolve('Already sent');
                }
            } else if(!result.success) {
                if(!res.headerSent) {
                    let code = 400;
                    if(result.extras.code == 404) code = 404;
                    else if(result.extras.code == 500) code = 500;
                    else if(result.extras.code == 503) code = 503;
                    logger.error(JSON.stringify(result));
                    resolve(res.status(code).json(await commonController.commonErrorHandler(result)));
                }
                else {
                    resolve('Already sent');
                }
            } else {
                if (!res.headerSent) {
                    resolve(res.status(500).json({ success: false, extras: { code: apiMessages.SERVER_ERROR.code, msg: apiMessages.SERVER_ERROR.description } }));
                }
                else {
                    resolve('Already sent');
                }
            }
        } catch (err) {
            console.log('Something wrong', err);
        }
    });
}

//Common Error Handler
commonController.commonErrorHandler = (error) => {
    return new Promise((resolve, reject) => {
        try {
            if(typeof error.success === "undefined" || error.success === null) {
                if (error instanceof SyntaxError) {
                    resolve({ success: false, extras: { code: apiMessages.SERVER_ERROR.code, msg: apiMessages.SERVER_ERROR.description } });
                } else {
                    resolve({ success: false, extras: { code: apiMessages.SERVICE_UNAVAILABLE.code, msg: apiMessages.SERVICE_UNAVAILABLE.description } });
                }
            } else {
                resolve(error);
            }
        } catch (err) {
            console.log('Something wrong', err);
        }
    });
}

commonController.commonPhoneNumberValidation = phoneNumber => {
    return new Promise(async (resolve, reject) => {
        try {
            if (phoneNumber === null || phoneNumber === undefined || phoneNumber === "") {
                resolve("Validated Successfully");
            } else {
                if (validator.isMobilePhone(String(phoneNumber), "en-IN")) {
                    resolve("Validated Successfully");
                } else {
                    throw { success: false, extras: { code: apiMessages.INVALID_PHONENUMBER.code, msg: apiMessages.INVALID_PHONENUMBER.description } }
                }
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

commonController.commonEmailValidation = emailID => {
    return new Promise(async (resolve, reject) => {
        try {
            if (emailID === null || emailID === undefined || emailID === "") {
                resolve("Validated Successfully");
            } else {
                if (validator.isEmail(emailID)) {
                    resolve("Validated Successfully");
                } else {
                    throw { success: false, extras: { code: apiMessages.INVALID_EMAIL_FORMAT.code, msg: apiMessages.INVALID_EMAIL_FORMAT.description } }
                }
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

module.exports = commonController;