const express = require('express')
const users = express.Router()
const userController = require('./users.controller')
const {userBodyValidation, userBodyValidator} = require('../../middlewares/users/validateUserBody')

//Get
users.get('/', userController.getUsers)
users.get('/:id', userController.getUserById)

//Post
users.post('/',[userBodyValidation, userBodyValidator] ,userController.createUser)

//Put
users.put('/:id', userController.editUser)

//Delete 
users.delete('/:id', userController.deleteUser)

module.exports = users