const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['system', 'meal', 'water', 'achievement'], default: 'system' },
    isRead: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('notification', NotificationSchema, 'notifications')