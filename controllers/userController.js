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
                    response.roleID = userData.roleID;
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

userController.checkWhetherPermissionAlreadyExist = (values, permissionID = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("permissionID --- ", permissionID);
            let query = {
                name: values.name
            };
            let result = await permissions.findOne(query).lean();
            if (result && !permissionID) {
                throw { success: false, extras: { code: apiMessages.PERMISSION_EXIST.code, msg: apiMessages.PERMISSION_EXIST.description } };
            }
            else if (permissionID && result && result.permissionID != permissionID) {
                console.log("ELSE IF condition");
                throw { success: false, extras: { code: apiMessages.PERMISSION_EXIST.code, msg: apiMessages.PERMISSION_EXIST.description } };
            }
            else {
                resolve("Validated Successfully");
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.getUserDetails = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                userID: userID,
            };
            let result = await users.findOne(query).select('-_id -__v -createdBy -updatedBy -passwordHash -passwordSalt').lean();
            
            //1.Male 2.Female 3.Other 4. Prefer not to say
            if(result.gender === 1) result.gender = 'Male';
            else if(result.gender === 2) result.gender = 'Female';
            else if(result.gender === 3) result.gender = 'Other';
            else if(result.gender === 4) result.gender = 'Prefer not to say';

            if (result && result.status) {
                resolve({ success: true, extras: { data: result } });
            } else if (result && !result.status) {
                throw { success: false, extras: { code: apiMessages.ACCOUNT_NOT_ACTIVE.code, msg: apiMessages.ACCOUNT_NOT_ACTIVE.description } };
            } else {
                throw { success: false, extras: { code: apiMessages.USER_DOES_EXIST.code, msg: apiMessages.USER_DOES_EXIST.description } };
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

// Check UserID Exists
userController.checkWhetherUserIDValid = (userIDs) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = false;
            if (Array.isArray(userIDs)) {
                for(let userID of userIDs) {
                    let query = {
                        userID: userID,
                        status: true
                    };
                    result = await users.exists(query);
                    if(!result) break;
                }
            }
            else {
                let query = {
                    userID: userIDs,
                    status: true
                };
                result = await users.exists(query);
            }

            if (result) {
                resolve("Validated Successfully");
            } else {
                throw { success: false, extras: { code: apiMessages.USER_DOES_EXIST.code, msg: apiMessages.USER_DOES_EXIST.description } };
            }
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
            let fndupdoptions = {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true,
            }

            await permissions.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
            let msg = apiMessages.UPDATED_SUCCESSFULLY.description;
            if(typeof updateData.status == "boolean") msg = apiMessages.DELETED_SUCCESSFULLY.description;
            resolve({ success: true, extras: { msg: msg } });
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.checkWhetherPermissionAlreadyExist = (values, permissionID = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("permissionID --- ", permissionID);
            let query = {
                name: values.name
            };
            let result = await permissions.findOne(query).lean();
            if ((result && !permissionID) || (permissionID && result && result.permissionID != permissionID)) {
                throw { success: false, extras: { code: apiMessages.PERMISSION_EXIST.code, msg: apiMessages.PERMISSION_EXIST.description } };
            } else {
                resolve("Validated Successfully");
            }
        } catch (error) {
            reject(await commonController.commonErrorHandler(error));
        }
    });
}

userController.checkWhetherRoleAlreadyExist = (values, roleID = null) => {
    return new Promise(async (resolve, reject) => {
        try{
            let query = {
                name: values.name
            };
            let result = await roles.findOne(query).lean();
            if(( result && !roleID ) || (roleID && result && result.roleID != roleID)) {
                throw { success: false, extras: { code: apiMessages.ROLE_EXIST.code, msg: apiMessages.ROLE_EXIST.description } };
            } else {
                resolve("Validate Successfully");
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

userController.updateRoleData = (roleID, updateData) => {
    return new Promise(async (resolve, reject) => {
        try{
            let fndupdquery = {
                roleID
            };
            let fndupdchanges = {
                $set: updateData
            };
            let fndupdoptions = {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true,
                multi: true
            }
            await roles.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -_v').lean();

            let msg = apiMessages.UPDATED_SUCCESSFULLY.description;
            if(typeof updateData.status == "boolean") msg = apiMessages.DELETED_SUCCESSFULLY.description;
            resolve({ success: true, extras: { msg: msg } });
        } catch (error) {

        }
    });
}

module.exports = userController;