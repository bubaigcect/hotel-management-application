// Dependencies
require('dotenv').config();
const validator = require("validator");
const uuid = require("uuid");

// Common Files
const apiMessages = require('../config/apiMessages');
const logger = require("../utils/logger");
const jwt = require('jsonwebtoken');
const permissions = require('../models/permissions');

const commonController = {};

// Common Response Handler
commonController.commonResponseHandler = (res, result) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(result.success) {
                if(!res.headerSent) {
                    // Log Success Response
                    logger.info(JSON.stringify(result));
                    resolve(res.status(200).json(result));
                }
                else {
                    resolve('Already sent');
                }
            } else if(!result.success) {
                if(!res.headerSent) {
                    let code = 400;
                    if(result.extras) {
                        if(result.extras.code == 404) code = 404;
                        else if(result.extras.code == 500) code = 500;
                        else if(result.extras.code == 503) code = 503;
                    }
                    // Log Error Response
                    logger.error(JSON.stringify(result));
                    resolve(res.status(code).json(await commonController.commonErrorHandler(result)));
                }
                else {
                    resolve('Already sent');
                }
            } else {
                if (!res.headerSent) {
                    let response = { success: false, extras: { code: apiMessages.SERVER_ERROR.code, msg: apiMessages.SERVER_ERROR.description } };
                    // Log Error Response
                    logger.error(JSON.stringify(response));
                    resolve(res.status(500).json(response));
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
                // Log Actual Error
                logger.error(error);

                let response = {};
                if (error instanceof SyntaxError) {
                    response = { success: false, extras: { code: apiMessages.SERVER_ERROR.code, msg: apiMessages.SERVER_ERROR.description } };
                } else {
                    response = { success: false, extras: { code: apiMessages.SERVICE_UNAVAILABLE.code, msg: apiMessages.SERVICE_UNAVAILABLE.description } };
                }
                // Log Error Response
                logger.error(JSON.stringify(response));
                resolve(response);
            } else {
                resolve(error);
            }
        } catch (err) {
            console.log('Something wrong', err);
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

// Common PermissionID Validation
commonController.commonPermissionIDValidation = values => {
    return new Promise(async (resolve, reject) => {
        try {
            if (values.permissions === null || values.permissions === undefined || values.permissions === "") {
                resolve("Validated Successfully");
            } else {
                if ( Array.isArray(values.permissions) && values.permissions.length > 0 && values.permissions.every((value) => uuid.validate(value)) ) {
                    resolve("Validated Successfully");
                } else {
                    throw { success: false, extras: { code: apiMessages.INVALID_PERMISSION_ID.code, msg: apiMessages.INVALID_PERMISSION_ID.description } };
                }
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

// Phone Number Validation Check Only for INDIA
commonController.commonPhoneNumberValidation = PhoneNumber => {
    return new Promise(async (resolve, reject) => {
        try {
            if (PhoneNumber === null || PhoneNumber === undefined || PhoneNumber === "") {
                resolve("Validated Successfully");
            } else {
                if (validator.isMobilePhone(String(PhoneNumber), "en-IN")) {
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

commonController.commonPasswordValidation = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const passwordUpperCase = /(?=.*[A-Z])/;
            const passwordLowerCase = /(?=.*[a-z])/;
            const passwordDigits = /(?=.*[0-9])/;
            const passwordLength = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            const passwordMatchRegex = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            //Step 1 ---> Validate one Uppercase
            //Step 2 ---> Validate one Lowercase
            //Step 3 ---> Validate one Number
            //Step 4 ---> Validate password Length(6 to 16)
            //Step 5 ---> Validate Complete password at once
            if (passwordUpperCase.test(password)) {
                if (passwordLowerCase.test(password)) {
                    if (passwordDigits.test(password)) {
                        if (passwordLength.test(password)) {
                            if (passwordMatchRegex.test(password)) {
                                resolve({ success: true, extras: { Status: apiMessages.VALIDATED_SUCCESSFULLY.description } })
                            } else {
                                throw { success: false, extras: { code: apiMessages.INVALID_PASSWORD.code, msg: apiMessages.INVALID_PASSWORD.description } }
                            }
                        } else {
                            throw { success: false, extras: { code: apiMessages.PASSWORD_MUST_BE_BETWEEN_6_AND_16_CHARACTERS.code, msg: apiMessages.PASSWORD_MUST_BE_BETWEEN_6_AND_16_CHARACTERS.description } }
                        }
                    } else {
                        throw { success: false, extras: { code: apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_NUMBER.code, msg: apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_NUMBER.description } }
                    }
                } else {
                    throw { success: false, extras: { code: apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_LOWERCASE.code, msg: apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_LOWERCASE.description } }
                }
            } else {
                throw { success: false, extras: { code: apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_UPPERCASE.code, msg: apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_UPPERCASE.description } }
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

commonController.randomOTPNumber = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let charBank = "123456789";
            let str = '';
            for (let i = 0; i < 4; i++) {
                str += charBank[parseInt(Math.random() * charBank.length)];
            };
            resolve(str);
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

commonController.generateToken = (userData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payload = {};
            payload.userID = userData.userID;
            payload.name = userData.name;
            payload.emailID = userData.emailID;
            payload.type = userData.type;

            const headers = {};
            headers.expiresIn = process.env.JWT_EXPIRYSECONDS;
            headers.algorithm = process.env.JWT_ALGORITHM;

            let accessToken = jwt.sign(payload, process.env.JWT_SECRET, headers);
            console.log("JWT Token- ", accessToken);
            resolve(accessToken);
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

module.exports = commonController;