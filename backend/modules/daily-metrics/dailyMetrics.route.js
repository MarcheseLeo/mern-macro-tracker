const express = require('express')
const dailyMetrics = express.Router()
const DailyMetricController = require('./dailyMetrics.controller')
const { updateWaterValidation, dailyMetricValidator } = require('../../middlewares/daily-metrics/validateMetricBody')
dailyMetrics.patch('/water', [updateWaterValidation, dailyMetricValidator], DailyMetricController.updateWater)

module.exports = dailyMetrics