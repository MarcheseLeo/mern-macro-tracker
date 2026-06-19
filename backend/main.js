const express = require('express')
const startServer = require('./config/db')
require('dotenv').config()

const port = process.env.PORT || 3000
//Dichiarazione Middlewares
const logger = require('./middlewares/globals/logger')
const errorHandler = require('./middlewares/errors/errorHandler')

//Dichiarazione Rotte
const users = require('./modules/users/users.route')
const foods = require('./modules/foods/foods.route')

const server = express()
server.use(express.json())

server.use(logger)

server.use('/users', users)
server.use('/foods', foods)
//Error Handler middleware
server.use(errorHandler)

startServer(port, server)