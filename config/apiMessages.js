let apiMessages = {};

apiMessages.NOT_FOUND = {code: 404, description: 'The server can not find requested URL.'};
apiMessages.BAD_REQUEST = {code: 400, description: 'The server could not understand the request due to invalid syntax.'};

apiMessages.SERVER_ERROR = {code: 500, description: 'Internal Server Error! Please contact support.'};
apiMessages.SERVICE_UNAVAILABLE = {code: 503, description: 'This service is currently unavailable.'};

// For Required Error
apiMessages.ENTER_ALL_TAGS = {code: 1000, description: 'Enter all tags.'};

// For Invalid Error
apiMessages.INVALID_PHONENUMBER = {code: 3000, description: 'Invalid phone number.'};
apiMessages.INVALID_EMAIL_FORMAT = {code: 3001, description: 'Invalid email format.'};
apiMessages.INVALID_PASSWORD = {code: 3002, description: 'Invalid password.'};

// For Others Error
apiMessages.EMAIL_NOT_REGISTERED_CONTACT_ADMIN = {code: 4000, description: 'Email Id is not registered. Please contact admin.'};
apiMessages.ACCOUNT_NOT_ACTIVE = {code: 4001, description: 'Account not Active.'};

// For Success Message
apiMessages.LOGIN_SUCCESSFULLY = { description: 'Login Successfully.' };

module.exports = apiMessages;