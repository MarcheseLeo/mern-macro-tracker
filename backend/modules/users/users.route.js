const express = require('express')
const users = express.Router()
const UserController = require('./users.controller')

//Get
users.get('/', UserController.getUsers)
users.get('/:id', UserController.getUserById)

//Put
users.put('/:id', UserController.editUser)

//Delete 
users.delete('/:id', UserController.deleteUser)

module.exports = users