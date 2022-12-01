let apiMessages = {};

apiMessages.NOT_FOUND = {code: 404, description: 'The server can not find requested URL.'};
apiMessages.BAD_REQUEST = {code: 400, description: 'The server could not understand the request due to invalid syntax.'};

apiMessages.SERVER_ERROR = {code: 500, description: 'Internal Server Error! Please contact support.'};
apiMessages.SERVICE_UNAVAILABLE = {code: 503, description: 'This service is currently unavailable.'};

// For Required Error
apiMessages.ENTER_ALL_TAGS = {code: 1000, description: 'Enter all tags.'};
apiMessages.TOKEN_REQUIRED = {code: 1001, description: 'Access token is required.'};

// For Invalid Error
apiMessages.INVALID_PHONENUMBER = {code: 3000, description: 'Invalid phone number.'};
apiMessages.INVALID_EMAIL_FORMAT = {code: 3001, description: 'Invalid email format.'};
apiMessages.INVALID_PASSWORD = {code: 3002, description: 'Invalid password.'};
apiMessages.JWT_MALFORMED = {code: 3003, description: 'Invalid token.'};
apiMessages.INVALID_PERMISSION_ID = {code: 3004, description: 'Invalid permission id.'};

// For Others Error
apiMessages.EMAIL_NOT_REGISTERED_CONTACT_ADMIN = {code: 4000, description: 'Email Id is not registered. Please contact admin.'};
apiMessages.ACCOUNT_NOT_ACTIVE = {code: 4001, description: 'Account not Active.'};
apiMessages.TOKEN_EXPIRED = {code: 4002, description: 'Your access token has been expired.'};
apiMessages.PERMISSION_EXIST = {code: 4003, description: 'Permission already exist.'};
apiMessages.ROLE_EXIST = {code: 4004, description: 'Role already exist.'};
apiMessages.EMAIL_EXIST = {code: 4005, description: 'Email id already registered.'};
apiMessages.PERMISSION_DOES_EXIST = {code: 4006, description: 'Permission does not exist'};
apiMessages.ROLE_DOES_EXIST = {code: 4007, description: 'Role does not exist'};
apiMessages.PASSWORD_MUST_BE_BETWEEN_6_AND_16_CHARACTERS = {code: 4008, description: 'Password must be between 6 and 16 characters.'};
apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_NUMBER = {code: 4009, description: 'Password must have atleast one number.'};
apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_LOWERCASE = {code: 4010, description: 'Password must have atleast one lowercase.'};
apiMessages.PASSWORD_MUST_HAVE_ATLEAST_ONE_UPPERCASE = {code: 4011, description: 'Password must have atleast one uppercase.'};

// For Success Message
apiMessages.LOGIN_SUCCESSFULLY = { description: 'Login Successfully.' };
apiMessages.CREATED_SUCCESSFULLY = { description: 'Created Successfully.' };
apiMessages.VALIDATED_SUCCESSFULLY = { description: 'Validated Successfully.' };
apiMessages.UPDATED_SUCCESSFULLY = { description: 'Updated Successfully.' };
apiMessages.DELETED_SUCCESSFULLY = { description: 'Deleted Successfully.' };

module.exports = apiMessages;