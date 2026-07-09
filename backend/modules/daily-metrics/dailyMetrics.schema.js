const mongoose = require('mongoose')

const DailyMetricSchema =new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    waterAmount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {timestamps: true})

DailyMetricSchema.index({user:1, date: 1}, {unique: true})

module.exports = mongoose.model('dailyMetric', DailyMetricSchema, 'dailyMetrics')

