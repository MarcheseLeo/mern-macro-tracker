const express = require('express')
const users = express.Router()
const UserController = require('./users.controller')

//Get
users.get('/me', UserController.getMe)
users.get('/', UserController.getUsers)
users.get('/:id', UserController.getUserById)


//Put
users.put('/me', UserController.editMe)
users.put('/:id', UserController.editUser)

//Delete 
users.delete('/me', UserController.deleteMe)
users.delete('/:id', UserController.deleteUser)

module.exports = users