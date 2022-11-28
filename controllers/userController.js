const crypto = require('crypto');
require('dotenv').config();
const ApiMessages = require('../config/ApiMessages');

const userController = {};

// Login Response Handler
userController.loginWithPassword = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.Password);
                let PasswordSalt = UserData.PasswordSalt;
                let pass = Password + PasswordSalt;
                let PasswordHash = crypto.createHash('sha512').update(pass).digest("hex");
                if (UserData.PasswordHash === PasswordHash) {
                    // let Result = await userController.Common_Login_Functionality_Response(UserData, DeviceData);
                    // resolve(Result);
                } else {
                    throw { success: false, extras: { code: 2, msg: ApiMessages.INVALID_PASSWORD } };
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

module.exports = userController;