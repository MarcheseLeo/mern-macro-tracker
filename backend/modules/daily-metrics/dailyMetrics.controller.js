const DailyMetricService = require('./dailyMetrics.service')

const updateWater = async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { date, amount } = req.body

        const updateMetric = await DailyMetricService.updateWater(userId, date, amount)

        res.status(200)
            .send({
                statusCode: 200,
                message: 'Water updated successfully',
                waterAmount: updateMetric.waterAmount
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    updateWater
}