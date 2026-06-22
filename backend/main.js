const express = require('express')
const startServer = require('./config/db')
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 3000
//Dichiarazione Middlewares
const logger = require('./middlewares/globals/logger')
const errorHandler = require('./middlewares/errors/errorHandler')
const verifyToken = require('./middlewares/auth/verifyToken')

//Dichiarazione Rotte
const auth = require('./modules/auth/auth.route')
const users = require('./modules/users/users.route')
const foods = require('./modules/foods/foods.route')
const meals = require('./modules/meals/meals.route')

const server = express()


server.use(cors({
    origin: 'http://localhost:5173'
}))

server.use(express.json())
server.use(logger)

server.use('/auth', auth)

server.use(verifyToken)


server.use('/users', users)
server.use('/foods', foods)
server.use('/meals', meals)
//Error Handler middleware
server.use(errorHandler)

startServer(port, server)