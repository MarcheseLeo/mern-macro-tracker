const User = require('../users/user.schema')
const Food = require('../foods/foods.schema')
const Feedback = require('../feedback/feedback.schema')

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('firstName lastName email avatar role isVerified createdAt lastActiveDate')
        res.send({ users })
    } catch (error) { next(error) }
}

const updateUser = async (req, res, next) => {
    try {
        const allowed = ['role', 'isVerified']
        const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)))
        if (Object.keys(update).length === 0) return res.status(400).send({ message: 'No editable fields provided.' })
        if (req.params.id === String(req.user.id) && update.role === 'user') return res.status(400).send({ message: 'You cannot remove your own administrator role.' })
        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('firstName lastName email avatar role isVerified createdAt lastActiveDate')
        if (!user) return res.status(404).send({ message: 'User not found.' })
        res.send({ user })
    } catch (error) { next(error) }
}

const getFoods = async (req, res, next) => {
    try {
        const foods = await Food.find().sort({ updatedAt: -1 }).limit(250)
        res.send({ foods })
    } catch (error) { next(error) }
}

const updateFood = async (req, res, next) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!food) return res.status(404).send({ message: 'Food not found.' })
        res.send({ food })
    } catch (error) { next(error) }
}

const getFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find().populate('user', 'firstName lastName email avatar').populate('handledBy', 'firstName lastName').sort({ createdAt: -1 })
        res.send({ feedback })
    } catch (error) { next(error) }
}

const updateFeedback = async (req, res, next) => {
    try {
        const { status, adminReply } = req.body
        const update = { handledBy: req.user.id }
        if (['open', 'in_review', 'resolved', 'rejected'].includes(status)) update.status = status
        if (typeof adminReply === 'string') update.adminReply = adminReply.trim()
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, update, { new: true }).populate('user', 'firstName lastName email avatar')
        if (!feedback) return res.status(404).send({ message: 'Request not found.' })
        res.send({ feedback })
    } catch (error) { next(error) }
}

module.exports = { getUsers, updateUser, getFoods, updateFood, getFeedback, updateFeedback }
