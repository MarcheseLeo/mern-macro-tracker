const Feedback = require('./feedback.schema')

const createFeedback = async (req, res, next) => {
    try {
        const { type, title, message } = req.body
        if (!['category_suggestion', 'problem_report', 'admin_request'].includes(type) || !title?.trim() || !message?.trim()) {
            return res.status(400).send({ message: 'Type, title and message are required.' })
        }

        const feedback = await Feedback.create({ type, title, message, user: req.user.id })
        res.status(201).send({ feedback })
    } catch (error) { next(error) }
}

module.exports = { createFeedback }
