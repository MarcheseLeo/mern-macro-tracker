const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema({
    type: { type: String, enum: ['category_suggestion', 'problem_report', 'admin_request'], required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['open', 'in_review', 'resolved', 'rejected'], default: 'open' },
    adminReply: { type: String, trim: true, maxlength: 2000 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })

module.exports = mongoose.model('feedback', FeedbackSchema, 'feedback')
