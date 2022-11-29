// Common Files
const commonController = require("../controllers/commonController");
const apiMessages = require("../config/apiMessages");
const userController = require("../controllers/userController");

const userMediator = {};

userMediator.loginWithPassword = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        if (
            values.emailID != null
            && values.password != null
        ) {
            await commonController.commonEmailValidation(values.emailID);
            let userData = await userController.validateEmailExist(values);
            console.log(userData);
            let result = await userController.loginWithPassword(values, userData);
            await commonController.commonResponseHandler(res, result);
        } else {
            throw { success: false, extras: { code: apiMessages.ENTER_ALL_TAGS.code, msg: apiMessages.ENTER_ALL_TAGS.description } };
        }
    } catch (error) {
        await commonController.commonResponseHandler(res, error);
    }
}

module.exports = userMediator;