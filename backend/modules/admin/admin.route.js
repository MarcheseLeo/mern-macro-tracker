const express = require('express')
const requireAdmin = require('../../middlewares/auth/requireAdmin')
const AdminController = require('./admin.controller')

const admin = express.Router()
admin.use(requireAdmin)
admin.get('/users', AdminController.getUsers)
admin.patch('/users/:id', AdminController.updateUser)
admin.get('/foods', AdminController.getFoods)
admin.patch('/foods/:id', AdminController.updateFood)
admin.get('/feedback', AdminController.getFeedback)
admin.patch('/feedback/:id', AdminController.updateFeedback)

module.exports = admin
