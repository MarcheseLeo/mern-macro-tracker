const express = require('express')
const notifications = express.Router()
const NotificationController = require('./notifications.controller')

notifications.get('/', NotificationController.getNotifications)

notifications.post('/achievements', NotificationController.createAchievementNotification)

notifications.patch('/:id/read', NotificationController.markAsRead)

module.exports = notifications