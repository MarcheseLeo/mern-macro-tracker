require('dotenv').config()
const express = require('express')
const startServer = require('./config/db')
const cors = require('cors')
const cookieParser = require('cookie-parser')

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

const server = express()

server.set('trust proxy', 1)

const allowedOrigins = [
    process.env.FRONTEND_URL
].filter(Boolean)

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

//Error Handler middleware
server.use(errorHandler)

startServer(port, server)