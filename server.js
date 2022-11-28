const express = require('express');
const cors = require('cors');
const path = require('path');
const ApiMessages = require('./config/ApiMessages');
const commonController = require('./controllers/commonController');
const routes = require('./routes/routes');
const connectToDb = require('./config/connect');
const app = express();
require('dotenv').config();

const PORT = parseInt(process.env.PORT) || 3001;
const BODY_PARSER_LIMIT = parseInt(process.env.BODY_PARSER_LIMIT) || '10mb';
const PARAMETER_LIMIT = parseInt(process.env.PARAMETER_LIMIT) || 100000000;

app.use(cors({ origin: "*" }));
app.use(express.raw({ limit: BODY_PARSER_LIMIT }));
app.use(express.json({ limit: BODY_PARSER_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_PARSER_LIMIT, parameterLimit: PARAMETER_LIMIT }));

app.use('/v1', routes);

//For 404 Route
app.use(async (req, res, next) => {
    let msg = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    let Result = { success: false, extras: { code: ApiMessages.NOT_FOUND.code, msg: ApiMessages.NOT_FOUND.description, Req: msg } };
    await commonController.commonResponseHandler(res, Result);
});

// For Application Error
app.use(async (err, req, res, next) => {
    console.error(err.stack)
    let Result = { success: false, extras: { code: ApiMessages.SERVER_ERROR.code, msg: ApiMessages.SERVER_ERROR.description, Req: msg } };
    await commonController.commonResponseHandler(res, Result);
});

app.listen(PORT, connectToDb(), () => console.log(`Server running on ${PORT}`));
