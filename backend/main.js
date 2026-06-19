const express = require('express')
const startServer = require('./config/db')
require('dotenv').config()

const port = process.env.PORT || 3000
//Dichiarazione Middlewares


//Dichiarazione Rotte

const server = express()
server.use(express.json())



//Error Handler middleware

startServer(port, server)