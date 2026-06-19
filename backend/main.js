const express = require('express')
const startServer = require('./config/db')
require('dotenv').config()

const port = process.env.PORT || 3000
//Dichiarazione Middlewares


//Dichiarazione Rotte
const users = require('./modules/users/users.route')

const server = express()
server.use(express.json())


server.use('/users', users)

//Error Handler middleware

startServer(port, server)