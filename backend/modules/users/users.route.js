const express = require('express')
const users = express.Router()
const UserController = require('./users.controller')
const { editUserValidation, userBodyValidator } = require('../../middlewares/users/validateUserBody')
//Get
users.get('/me', UserController.getMe)
users.get('/', UserController.getUsers)
users.get('/:id', UserController.getUserById)


//Put
users.put('/me', [editUserValidation, userBodyValidator], UserController.editMe)
users.put('/:id', [editUserValidation, userBodyValidator], UserController.editUser)

//Delete 
users.delete('/me', UserController.deleteMe)
users.delete('/:id', UserController.deleteUser)

module.exports = users