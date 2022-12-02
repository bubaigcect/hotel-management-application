// Dependencies
require('dotenv').config();

// Common Files
const commonController = require("../controllers/commonController");
const apiMessages = require("../config/apiMessages");
const userController = require("../controllers/userController");

const commonMediator = {};

// For Verify Access
commonMediator.verifyAccess = async (req, res, next) => {
    console.log(req.url);
    console.log(req.userData);
    try{
        let roleID = res.userData.roleID;
    } catch (error) {

    }

    // try{
    //     if(req.headers.authorization) {
    //         const accessToken = req.headers.authorization.split(" ")[1];
    //         console.log("Verify Token entered", accessToken);
    //         req.userData = await jwt.verify(accessToken, process.env.JWT_SECRET);
    //         next();
    //     } else {
    //         throw { success: false, extras: {code: apiMessages.TOKEN_REQUIRED.code, msg: apiMessages.TOKEN_REQUIRED.description } }; 
    //     }
    // } catch (error) {
    //     console.log(error.name, error.message);
    //     let errorResponse = { success: false, extras: { code: apiMessages.SERVER_ERROR.code, msg: apiMessages.SERVER_ERROR.description } };
    //     if(error.name == "TokenExpiredError") {
    //         errorResponse = { success: false, extras: {code: apiMessages.TOKEN_EXPIRED.code, msg: apiMessages.TOKEN_EXPIRED.description } }; 
    //     }
    //     else if(error.name == "JsonWebTokenError") {
    //         errorResponse = { success: false, extras: {code: apiMessages.JWT_MALFORMED.code, msg: apiMessages.JWT_MALFORMED.description } }; 
    //     }
    //     await commonController.commonResponseHandler(res, errorResponse);
    // }
}

module.exports = commonMediator;