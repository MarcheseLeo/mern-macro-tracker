const NotificationSchema = require('./notifications.schema')
const UserSchema = require('../users/user.schema')

const startOfToday = () => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getNotifications = async (userId) => {
    const user = await UserSchema.findById(userId);
    if (!user || !user.preferences?.notifications) return [];

    const allowedTypes = ['system']
    if (user.preferences?.mealReminders) allowedTypes.push('meal')
    if (user.preferences?.waterReminders) allowedTypes.push('water')
    if (user.preferences?.achievements) allowedTypes.push('achievement')

    return await NotificationSchema.find({ user: userId, type: { $in: allowedTypes } })
        .sort({ createdAt: -1 })
        .limit(10);
}

const createNotification = async (user, message, type = 'system', dedupeKey) => {
    if (!user?.preferences?.notifications) return null
    if (type === 'meal' && !user.preferences?.mealReminders) return null
    if (type === 'water' && !user.preferences?.waterReminders) return null
    if (type === 'achievement' && !user.preferences?.achievements) return null

    if (dedupeKey) {
        const existing = await NotificationSchema.findOne({
            user: user._id,
            type,
            message: { $regex: escapeRegExp(dedupeKey) },
            createdAt: { $gte: startOfToday() }
        })

        if (existing) return existing
    }

    return NotificationSchema.create({
        user: user._id,
        message,
        type
    })
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
        await createNotification(user, `Welcome back, ${user.firstName}! A fresh day, a clean log, and your goals are waiting.`, 'system', 'Welcome back')
    }
}
const createRegisterNotification = async (userId) => {
    const user = await UserSchema.findById(userId)
    console.log(user)

    await createNotification(user, `Welcome on board, ${user.firstName}! Your MacroTracker account is ready. Start with one meal and build from there.`, 'system')
}

const createAchievementNotification = async (userId, message) => {
    const user = await UserSchema.findById(userId)
    
    if (user && user.preferences?.achievements) {
        await createNotification(user, message, 'achievement', message.slice(0, 24))
    }
}

const createMealReminder = async (user, mealType) => {
    const messages = {
        breakfast: `Morning, ${user.firstName}! Breakfast is a great first anchor for today's macros.`,
        lunch: `Lunch check-in, ${user.firstName}: log it now while the details are still fresh.`,
        dinner: `Dinner time. Add your meal and close the day with a clearer picture.`,
        snackMorning: `Small snack? Track it now so the tiny bites do not disappear from your day.`,
        snackAfternoon: `Snack break. A quick log keeps your calories and macros honest.`
    }

    return createNotification(user, messages[mealType], 'meal', mealType)
}

const createWaterReminder = async (user, waterAmount = 0) => {
    const remaining = Math.max(0, 2 - waterAmount).toFixed(1)
    const message = waterAmount > 0
        ? `Hydration check: you have logged ${waterAmount.toFixed(1)}L today. About ${remaining}L to reach 2L.`
        : `Hydration check: no water logged yet today. Add your first glass and keep the day moving.`

    return createNotification(user, message, 'water', 'Hydration check')
}

module.exports = {
    getNotifications,
    markAsRead,
    createLoginNotification,
    createRegisterNotification,
    createAchievementNotification,
    createMealReminder,
    createWaterReminder
}
