const express = require('express')
const { createFeedback } = require('./feedback.controller')

const feedback = express.Router()
feedback.post('/', createFeedback)

module.exports = feedback
