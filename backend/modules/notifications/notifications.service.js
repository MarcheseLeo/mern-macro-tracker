const NotificationSchema = require('./notifications.schema')
const UserSchema = require('../users/user.schema')

const getNotifications = async (userId) => {
    const user = await UserSchema.findById(userId);
    if (!user) return [];

    const allowedTypes = ['system']
    if (user.preferences?.mealReminders) allowedTypes.push('meal')
    if (user.preferences?.waterReminders) allowedTypes.push('water')
    if (user.preferences?.achievements) allowedTypes.push('achievement')

    return await NotificationSchema.find({ user: userId, type: { $in: allowedTypes } })
        .sort({ createdAt: -1 })
        .limit(10);
}

const markAsRead = async (id) => {
    await NotificationSchema.findByIdAndUpdate(id, { isRead: true })
    setTimeout(async () => {
        await NotificationSchema.findByIdAndDelete(id)
    }, 10000)
}

const createLoginNotification = async (userId) => {
    const user = await UserSchema.findById(userId)

    if (user && user.preferences?.notifications) {
        await NotificationSchema.create({
            user: user._id,
            message: `Welcome back, ${user.firstName}! Ready to crush your goals today? 🚀`,
            type: 'system'
        })
    }
}
const createRegisterNotification = async (userId) => {
    const user = await UserSchema.findById(userId)
    console.log(user)

    await NotificationSchema.create({
        user: user._id,
        message: `Welcome on board, ${user.firstName}!Your MacroTracker account is now fully active, start tracking your progress right away. 🚀`,
        type: 'system'
    })
}

const createAchievementNotification = async (userId, message) => {
    const user = await UserSchema.findById(userId)
    
    if (user && user.preferences?.achievements) {
        await NotificationSchema.create({
            user: user._id,
            message: message,
            type: 'achievement'
        })
    }
}

module.exports = {
    getNotifications,
    markAsRead,
    createLoginNotification,
    createRegisterNotification,
    createAchievementNotification
}