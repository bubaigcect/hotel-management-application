const mongoose = require('mongoose');
const users = new mongoose.Schema({
    USERID: { type: String, default: "" },
    Name: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    EmailID: { type: String, default: "" },
    Gender: { type: Number, default: 4 }, //1.Male 2.Female 3.Other 4. Prefer not to say
    Whether_Password_Setted: { type: Boolean, default: false },
    PasswordHash: { type: String, default: "" },
    PasswordSalt: { type: String, default: "" },
    Status: { type: Boolean, default: true },
}, { collection: 'Users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
users.index({ EmailID: -1 });
module.exports = mongoose.model('Users', users);