// Dependencies
const crypto = require('crypto');
require('dotenv').config();
const uuid = require("uuid");

// Common Files
const apiMessages = require('../config/apiMessages');
const commonController = require('../controllers/commonController');

// Models
const users = require('../models/users');
const permissions = require('../models/permissions');
const roles = require('../models/roles');
const { resolve } = require('path');

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

                    resolve({ success: true, extras: { msg: apiMessages.LOGIN_SUCCESSFULLY.description, data: response } });
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

userController.checkWhetherPermissionAlreadyExist = (values) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                name: values.name
            };
            let result = await permissions.findOne(query).lean();
            if (result === null) {
                resolve("Validated Successfully");
            } else {
                throw { success: false, extras: { code: apiMessages.PERMISSION_EXIST.code, msg: apiMessages.PERMISSION_EXIST.description } };
            };
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

// Check PermissionID Exists
userController.checkWhetherPermissionIDValid = (permissionIDs) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = false;
            if (Array.isArray(permissionIDs)) {
                for(let permissionID of permissionIDs) {
                    let query = {
                        permissionID: permissionID,
                        status: true
                    };
                    result = await permissions.exists(query);
                    if(!result) break;
                }
            }
            else {
                let query = {
                    permissionID: permissionIDs,
                    status: true
                };
                result = await permissions.exists(query);
            }

            if (result) {
                resolve("Validated Successfully");
            } else {
                throw { success: false, extras: { code: apiMessages.PERMISSION_DOES_EXIST.code, msg: apiMessages.PERMISSION_DOES_EXIST.description } };
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

// Check RoleID Exists
userController.checkWhetherRoleIDValid = (roleIDs) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = false;
            if (Array.isArray(roleIDs)) {
                for(let permissionID of roleIDs) {
                    let query = {
                        roleID: permissionID,
                        status: true
                    };
                    result = await roles.exists(query);
                    if(!result) break;
                }
            }
            else {
                let query = {
                    roleID: roleIDs,
                    status: true
                };
                result = await roles.exists(query);
            }

            if (result) {
                resolve("Validated Successfully");
            } else {
                throw { success: false, extras: { code: apiMessages.ROLE_DOES_EXIST.code, msg: apiMessages.ROLE_DOES_EXIST.description } };
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.checkWhetherEmailIDAlreadyExist = (values) => {
    return new Promise(async (resolve, reject) => {
        try{
            let query = {
                emailID: values.emailID
            };
            let result = await users.findOne(query).lean();
            if (result === null) {
                resolve("Validate Successfully");
            } else {
                throw { success: false, extras: { code: apiMessages.EMAIL_EXIST.code, msg: apiMessages.EMAIL_EXIST.description } };
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.addUser = (values) => {
    return new Promise(async (resolve, reject) => {
        try {
            let password = values.password;
            let passwordSalt = await commonController.randomOTPNumber();
            let pass = password + passwordSalt;
            let data = {
                userID: uuid.v4(),
                name: values.name,
                emailID: values.emailID,
                phoneNumber: values.phoneNumber,
                gender: values.gender,
                passwordHash: crypto.createHash('sha512').update(pass).digest("hex"),
                passwordSalt: passwordSalt,
                type: values.type,
                roleID: values.roleID,
                createdBy: values.userID
            };
            await users(data).save();
            
            resolve({ success: true, extras: { Status: apiMessages.CREATED_SUCCESSFULLY.description } });
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.addPermission = (values) => {
    return new Promise(async (resolve, reject) => {
        try{
            let data = {
                permissionID: uuid.v4(),
                name: values.name,
                description: values.description,
                createdBy: values.userID
            }
            await permissions(data).save();

            resolve({ success: true, extras: { msg: apiMessages.CREATED_SUCCESSFULLY.description } });
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.updatePermissionData = (permissionID, updateData) => {
    return new Promise(async (resolve, reject) => {
        try{
            let fndupdquery = {
                permissionID
            };
            let fndupdchanges = {
                $set: updateData
            };
            // let fndupdoptions = {
            //     upsert: true,
            //     setDefaultsOnInsert: true,
            //     new: true
            // }
            
            await permissions.findOneAndUpdate(fndupdquery, fndupdchanges).lean();
            let msg = apiMessages.UPDATED_SUCCESSFULLY.description;
            console.log("TypeOF", typeof updateData.status)
            if(typeof updateData.status == "boolean") msg = apiMessages.DELETED_SUCCESSFULLY.description;
            resolve({ success: true, extras: { msg: msg } });
        } catch (error) {

        }
    });
} 

userController.checkWhetherRoleAlreadyExist = (values) => {
    return new Promise(async (resolve, reject) => {
        try{
            let query = {
                name: values.name
            };
            let result = await roles.findOne(query).lean();
            if(result === null) {
                resolve("Validate Successfully");
            } else {
                throw { success: false, extras: { code: apiMessages.ROLE_EXIST.code, msg: apiMessages.ROLE_EXIST.description } };
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.addRole = (values) => {
    return new Promise(async (resolve, reject) => {
        try{
            let data = {
                roleID: uuid.v4(),
                name: values.name,
                description: values.description,
                permissions: values.permissions,
                createdBy: values.userID
            };
            await roles(data).save();
            
            resolve({ success: true, extras: { msg: apiMessages.CREATED_SUCCESSFULLY.description } });
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

// AdminController.Create_Super_Admin = (values) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let Password = String(values.Password);
//             let PasswordSalt = await CommonController.Random_OTP_Number();
//             let pass = Password + PasswordSalt;
//             let Data = {
//                 AdminID: uuid.v4(),
//                 Name: values.Name,
//                 EmailID: values.EmailID,
//                 PhoneNumber: values.PhoneNumber,
//                 PasswordHash: crypto.createHash('sha512').update(pass).digest("hex"),
//                 PasswordSalt: PasswordSalt,
//                 Roles: {
//                     Whether_Super_Admin: true
//                 },
//             };
//             let SaveResult = await Admins(Data).save();
//             resolve({ success: true, extras: { Status: CommonMessages.CREATED_SUCCESSFULLY } });
//         } catch (error) {
//             reject(await CommonController.Common_Error_Handler(error));
//         }
//     });
// }

module.exports = userController;