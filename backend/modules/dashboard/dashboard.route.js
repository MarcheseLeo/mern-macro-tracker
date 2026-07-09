const express = require('express')
const dashboard = express.Router()
const DashboardController = require('./dashboard.controller')

dashboard.get('/summary', DashboardController.getDailySummary)

module.exports = dashboard