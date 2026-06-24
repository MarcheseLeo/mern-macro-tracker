const express = require('express')
const users = express.Router()
const UserController = require('./users.controller')
const { editUserValidation, changePasswordValidation, userBodyValidator } = require('../../middlewares/users/validateUserBody')
const {cloud} = require('../../middlewares/multer/index')

//Get
users.get('/me', UserController.getMe)
// users.get('/', UserController.getUsers)
// users.get('/:id', UserController.getUserById)


//PATCH
users.patch('/me', [editUserValidation, userBodyValidator], UserController.editMe)
users.patch('/me/avatar', cloud.single('avatar'), UserController.uploadAvatar)
users.patch('/me/password', [changePasswordValidation, userBodyValidator], UserController.updatePassword)
// users.patch('/:id', [editUserValidation, userBodyValidator], UserController.editUser)

//Delete 
users.delete('/me', UserController.deleteMe)
// users.delete('/:id', UserController.deleteUser)

module.exports = users