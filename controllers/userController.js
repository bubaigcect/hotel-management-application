// Dependencies
const crypto = require('crypto');
require('dotenv').config();

// Common Files
const apiMessages = require('../config/apiMessages');
const commonController = require('../controllers/commonController');

// Models
const users = require('../models/users');

const userController = {};

// Login Response Handler
userController.loginWithPassword = (values, userData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let password = String(values.password);
                let passwordSalt = userData.passwordSalt;
                let pass = password + passwordSalt;
                let passwordHash = crypto.createHash('sha512').update(pass).digest("hex");
                console.log("PasswordHAsh- ", passwordHash);
                if (userData.passwordHash === passwordHash) {
                    console.log("Entered password match sections");
                    // let result = await userController.Common_Login_Functionality_Response(UserData, DeviceData);
                    // resolve(result);
                    delete userData.passwordHash;
                    delete userData.passwordSalt;
                    delete userData.passwordHash;

                    resolve({ success: true, extras: { msg: apiMessages.LOGIN_SUCCESSFULLY.description, Data: userData } });

                } else {
                    throw { success: false, extras: { code: apiMessages.INVALID_PASSWORD.code, msg: apiMessages.INVALID_PASSWORD.description } };
                }
            } catch (error) {
                reject(await commonController.commonErrorHandler(error));
            }
        });
    });
}

userController.validateEmailExist = values => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                emailID: values.emailID
            };
            let result = await users.findOne(query).select('-_id -_v').lean();
            if (result === null) {
                throw { success: false, extras: { code: apiMessages.EMAIL_NOT_REGISTERED_CONTACT_ADMIN.code, msg: apiMessages.EMAIL_NOT_REGISTERED_CONTACT_ADMIN.description } }
            } else {
                if (result.status) {
                    resolve(result);
                } else {
                    throw { success: false, extras: { code: apiMessages.ACCOUNT_NOT_ACTIVE.code, msg: apiMessages.ACCOUNT_NOT_ACTIVE.description } }
                }
            };
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

module.exports = userController;