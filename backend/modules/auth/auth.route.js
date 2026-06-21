const AuthController = require('./auth.controller')
const express = require('express')
const auth = express.Router()

auth.post('/auth/login', AuthController.login)

module.exports = auth