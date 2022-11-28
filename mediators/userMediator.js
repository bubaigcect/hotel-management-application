const commonController = require("../controllers/commonController");
const ApiMessages = require("../config/ApiMessages");
const userController = require("../controllers/userController");

const userMediator = {};

userMediator.loginWithPassword = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        if (
            values.ApiKey != null
            && values.PhoneNumber != null
            && values.Password != null
        ) {
            let ValidityStatus = await commonController.commonPhoneNumberValidation(values.PhoneNumber);
            await commonController.commonResponseHandler(res, ValidityStatus);
        } else {
            throw { success: false, extras: { code: 2, msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        await CommonController.commonResponseHandler(res, error);
    }
}


module.exports = userMediator;