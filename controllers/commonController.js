require('dotenv').config();
const ApiMessages = require('../config/ApiMessages');

let commonController = function () { };

// Common Response Handler
commonController.commonResponseHandler = (res, result) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(result.success) {
                if(!res.headerSent) {
                    resolve(res.status(200).json(result))
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
                    resolve(res.status(code).json(await commonErrorHandler(result)));
                }
                else {
                    resolve('Already sent');
                }
            } else {
                if (!res.headerSent) {
                    resolve(res.status(400).json({ success: false, extras: { code: ApiMessages.SERVER_ERROR.code, msg: ApiMessages.SERVER_ERROR.description } }));
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
                    resolve({ success: false, extras: { code: ApiMessages.SERVER_ERROR.code, msg: ApiMessages.SERVER_ERROR.description } });
                } else {
                    resolve({ success: false, extras: { code: ApiMessages.SERVICE_UNAVAILABLE.code, msg: ApiMessages.SERVICE_UNAVAILABLE.description } });
                }
            } else {
                resolve(error);
            }
        } catch (err) {
            console.log('Something wrong', err);
        }
    });
}

commonController.commonPhoneNumberValidation = PhoneNumber => {
    return new Promise(async (resolve, reject) => {
        try {
            if (PhoneNumber === null || PhoneNumber === undefined || PhoneNumber === "") {
                resolve("Validated Successfully");
            } else {
                if (validator.isMobilePhone(String(PhoneNumber), "en-IN")) {
                    resolve("Validated Successfully");
                } else {
                    throw { success: false, extras: { code: 2, msg: ApiMessages.INVALID_PHONENUMBER } }
                }
            }
        } catch (error) {
            reject(await CommonController.Common_Error_Handler(error));
        }
    });
}

module.exports = commonController;