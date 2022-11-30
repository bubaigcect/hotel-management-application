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
                if (userData.passwordHash === passwordHash) {
                    // Generate JWT Token
                    const accessToken = await commonController.generateToken(userData);

                    // Response data
                    const response = {};
                    response.userID = userData.userID;
                    response.name = userData.name;
                    response.emailID = userData.emailID;
                    response.status = userData.status;
                    response.type = userData.type;
                    response.accessToken = accessToken;

                    //1.Male 2.Female 3.Other 4. Prefer not to say
                    if(userData.gender === 1) userData.gender = 'Male';
                    else if(userData.gender === 2) userData.gender = 'Female';
                    else if(userData.gender === 3) userData.gender = 'Other';
                    else if(userData.gender === 4) userData.gender = 'Prefer not to say';

                    resolve({ success: true, extras: { msg: apiMessages.LOGIN_SUCCESSFULLY.description, Data: response } });
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
            let result = await users.findOne(query, {}).lean();
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