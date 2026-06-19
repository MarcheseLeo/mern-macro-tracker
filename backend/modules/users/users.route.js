const express = require('express')
const users = express.Router()
const userController = require('./users.controller')

//Get
users.get('/', userController.getUsers)
users.get('/:id', userController.getUserById)

//Post
users.post('/', userController.createUser)

//Put
users.put('/:id', userController.editUser)

//Delete 
users.delete('/:ïd', userController.deleteUser)

module.exports = users