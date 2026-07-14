const AuthController = require('./auth.controller')
const express = require('express')
const auth = express.Router()
const {userBodyValidation, userBodyValidator} = require('../../middlewares/users/validateUserBody')


//POST
auth.post('/login', AuthController.login)
auth.post('/register',[userBodyValidation, userBodyValidator], AuthController.register)
auth.post('/refresh', AuthController.refreshToken) 
auth.post('/logout', AuthController.logout)
auth.post('/forgot-password', AuthController.forgotPassword)
auth.post('/reset-password', AuthController.resetPassword)

//PATCH
auth.patch('/verify', AuthController.verifyEmail)
module.exports = auth