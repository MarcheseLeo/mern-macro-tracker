require('dotenv').config()
const express = require('express')
const startServer = require('./config/db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cron = require('node-cron')
const UserSchema = require('./modules/users/user.schema')
const EmaliService = require('./modules/email/email.service')
const NotificationService = require('./modules/notifications/notifications.service')
const DailyMetricSchema = require('./modules/daily-metrics/dailyMetrics.schema')

const port = process.env.PORT || 3000

//Dichiarazione Middlewares
const logger = require('./middlewares/globals/logger')
const errorHandler = require('./middlewares/errors/errorHandler')
const verifyToken = require('./middlewares/auth/verifyToken')

//Dichiarazione Rotte
const auth = require('./modules/auth/auth.route')
const googleOauth = require('./modules/oauth/oauth.route')
const users = require('./modules/users/users.route')
const foods = require('./modules/foods/foods.route')
const meals = require('./modules/meals/meals.route')
const dailyMetrics = require('./modules/daily-metrics/dailyMetrics.route')
const dashboard = require('./modules/dashboard/dashboard.route')
const notifications = require('./modules/notifications/notifications.route')

const server = express()

server.set('trust proxy', 1)

const allowedOrigins = [
    ...(process.env.FRONTEND_URL || '').split(','),
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
].map(origin => origin.trim()).filter(Boolean)

server.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

server.use(express.json())
server.use(cookieParser())
server.use(logger)

server.use('/auth', auth)
server.use('/auth', googleOauth)

server.use(verifyToken)


server.use('/users', users)
server.use('/foods', foods)
server.use('/meals', meals)
server.use('/metrics', dailyMetrics)
server.use('/dashboard', dashboard)
server.use('/notifications', notifications)

//Error Handler middleware
server.use(errorHandler)

startServer(port, server)


//EMAILS EVERY FRIDAY
cron.schedule('0 18 * * 5', async () => {
    console.log('⏰ Sending weekly emails ...')
    try {
        const users = await UserSchema.find({ 'preferences.emailSummary': true, isVerified: true })

        for (const user of users) {
            await EmaliService.sendWeeklyReport(user)
        }
        console.log(`✅ Weekly recap sent to ${users.length} users.`)
    } catch (e) {
        console.error('Error during cron job:', e)
    }
}, {
    timezone: "Europe/Rome"
})

// 🍳 BREAKFAST (Hours 08:00)
cron.schedule('0 8 * * *', async () => {
    try {
        const users = await UserSchema.find({ 'preferences.notifications': true, 'preferences.mealReminders': true, isVerified: true })
        for (const u of users) {
            await NotificationService.createMealReminder(u, 'breakfast')
        }
    } catch (e) {
        console.error('❌ Error during breakfast cron:', e)
    }
}, {
    timezone: "Europe/Rome"
})

// 🥗 LUNCH (Hours 13:00)
cron.schedule('0 13 * * *', async () => {
    try {
        const users = await UserSchema.find({ 'preferences.notifications': true, 'preferences.mealReminders': true, isVerified: true })
        for (const u of users) {
            await NotificationService.createMealReminder(u, 'lunch')
        }
    } catch (e) {
        console.error('❌ Error during lunch cron:', e)
    }
}, {
    timezone: "Europe/Rome"
})

// 🍝 DINNER (Hours 20:00)
cron.schedule('0 20 * * *', async () => {
    try {
        const users = await UserSchema.find({ 'preferences.notifications': true, 'preferences.mealReminders': true, isVerified: true })
        for (const u of users) {
            await NotificationService.createMealReminder(u, 'dinner')
        }
    } catch (e) {
        console.error('❌ Error during dinner cron:', e)
    }
}, {
    timezone: "Europe/Rome"
})

// 🍫 SNACKS (Hours 17:00)
cron.schedule('0 17 * * *', async () => {
    try {
        const users = await UserSchema.find({ 'preferences.notifications': true, 'preferences.mealReminders': true, isVerified: true })
        for (const u of users) {
            await NotificationService.createMealReminder(u, 'snackAfternoon')
        }
    } catch (e) {
        console.error('❌ Error during snack cron:', e)
    }
}, {
    timezone: "Europe/Rome"
})

// 🍫 SNACKS (Hours 11:00)
cron.schedule('0 11 * * *', async () => {
    try {
        const users = await UserSchema.find({ 'preferences.notifications': true, 'preferences.mealReminders': true, isVerified: true })
        for (const u of users) {
            await NotificationService.createMealReminder(u, 'snackMorning')
        }
    } catch (e) {
        console.error('❌ Error during snack cron:', e)
    }
}, {
    timezone: "Europe/Rome"
})

// 💧 WATER (Hours 16:00 - Checks if you drinked less than 2 liters)
cron.schedule('0 16 * * *', async () => {
    try {
        const users = await UserSchema.find({ 'preferences.notifications': true, 'preferences.waterReminders': true, isVerified: true })
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)
        for (const u of users) {
            const metric = await DailyMetricSchema.findOne({ user: u._id, date: { $gte: today } })
            if (!metric || metric.waterAmount < 2) {
                await NotificationService.createWaterReminder(u, metric?.waterAmount || 0)
            }
        }
    } catch (e) {
        console.error('❌ Error during water cron:', e)
    }
}, {
    timezone: "Europe/Rome"
})
