let ApiMessages = {};

ApiMessages.NOT_FOUND = {code: 404, description: 'The server can not find requested URL.'};
ApiMessages.BAD_REQUEST = {code: 400, description: 'The server could not understand the request due to invalid syntax.'};

ApiMessages.SERVER_ERROR = {code: 500, description: 'Internal Server Error! Please contact support.'};
ApiMessages.SERVICE_UNAVAILABLE = {code: 503, description: 'This service is currently unavailable.'};

// For File Error
ApiMessages.INVALID_IMAGE_FILE = {code: 3000, description: 'Please upload a valid image file.'};
ApiMessages.INVALID_IMAGE_FILE_SIZE = {code: 3001, description: 'File Size is too large.'};
ApiMessages.IMAGE_FILES_LIMIT_EXCEEDED = {code: 3002, description: 'Max files limit exceeded.'};
ApiMessages.UNKNOWN_FILE_UPLOAD_ERROR = {code: 3003, description: 'Unknown file upload error.'};
ApiMessages.FILE_NOT_FOUND = {code: 3004, description: 'File not found.'};

// For Success Message


module.exports = ApiMessages;