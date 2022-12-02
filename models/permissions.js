const mongoose = require('mongoose');
const permissions = new mongoose.Schema({
    permissionID: { type: String, default: "" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    status: { type: Boolean, default: true },
}, { collection: 'permissions', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
permissions.index({ name: -1 });
module.exports = mongoose.model('permissions', permissions);