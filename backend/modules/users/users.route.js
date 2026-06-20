const express = require('express')
const users = express.Router()
const UserController = require('./users.controller')
const {userBodyValidation, userBodyValidator} = require('../../middlewares/users/validateUserBody')

//Get
users.get('/', UserController.getUsers)
users.get('/:id', UserController.getUserById)

//Post
users.post('/',[userBodyValidation, userBodyValidator] ,UserController.createUser)

//Put
users.put('/:id', UserController.editUser)

//Delete 
users.delete('/:id', UserController.deleteUser)

module.exports = users