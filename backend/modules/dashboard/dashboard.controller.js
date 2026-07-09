const DashboardService = require('./dashboard.service')
const MealService = require('../meals/meals.service')

const getDailySummary = async (req, res, next) => {
    try {
        const { id } = req.user
        const { date } = req.query

        const summary = await DashboardService.getDailySummary(id, date)
        const meals = await MealService.getMeals(id, date)
        res.status(200)
            .send({
                statusCode: 200,
                message: 'Daily summary fetched successfully',
                summary,
                meals,
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getDailySummary
}