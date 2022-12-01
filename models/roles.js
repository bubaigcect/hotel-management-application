const mongoose = require('mongoose');
const roles = new mongoose.Schema({
    roleID: { type: String, default: "" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    permissions: [String],
    createdBy: { type: String, default: "" },
    status: { type: Boolean, default: true },
}, { collection: 'roles', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
roles.index({ name: -1 });
module.exports = mongoose.model('roles', roles);