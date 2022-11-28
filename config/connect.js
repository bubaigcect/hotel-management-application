const mongoose = require("mongoose");
require('dotenv').config();

// mongoose.Promise = global.Promise;
const connectToDb = async () => {
    let mongoURL = process.env.DATABASE_URL;
    let options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    try {
        await mongoose.connect(mongoURL, options);
        console.log(`Connected to mongo db--->${mongoURL}`);
    }
    catch (error) {
        console.error('Could not connect to MongoDB');
    }
}

module.exports = connectToDb;