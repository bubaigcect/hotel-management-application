const mongoose = require('mongoose');
const users = new mongoose.Schema({
    userID: { type: String, default: "" },
    name: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    emailID: { type: String, default: "" },
    gender: { type: Number, default: 4 }, //1.Male 2.Female 3.Other 4. Prefer not to say
    passwordHash: { type: String, default: "" },
    passwordSalt: { type: String, default: "" },
    type: { type: String, default: "user" },
    status: { type: Boolean, default: true },
}, { collection: 'users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
users.index({ emailID: -1 });
module.exports = mongoose.model('users', users);