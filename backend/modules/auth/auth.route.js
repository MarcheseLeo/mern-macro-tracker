const AuthController = require('./auth.controller')
const express = require('express')
const auth = express.Router()
const {userBodyValidation, userBodyValidator} = require('../../middlewares/users/validateUserBody')

auth.post('/login', AuthController.login)
auth.post('/register',[userBodyValidation, userBodyValidator], AuthController.register)
module.exports = auth