const MealSchema = require('../meals/meals.schema')
const DailyMetricSchema = require('../daily-metrics/dailyMetrics.schema')
const UserSchema = require('../users/user.schema')

const getDailySummary = async (userId, dateString) => {
    const targetDate = dateString ? new Date(dateString) : new Date()

    const startOfDay = new Date(targetDate)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(targetDate)
    endOfDay.setUTCHours(23, 59, 59, 999)

    const meals = await MealSchema.find({
        user: userId,
        date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('items.foodId')

    const dailyMetrics = await DailyMetricSchema.findOne({
        user: userId,
        date: startOfDay
    })

    const user = await UserSchema.findById(userId).select('weightHistory')
    let activeWeight = 0

    if (user && user.weightHistory && user.weightHistory.length > 0) {
        const pastWeights = user.weightHistory.filter(entry => entry.date <= endOfDay)

        if (pastWeights.length > 0) {
            pastWeights.sort((a, b) => new Date(a.date) - new Date(b.date));
            activeWeight = pastWeights[pastWeights.length - 1].weight;
        }
    }

    const summary = meals.reduce((acc, meal) => {
        acc.kcal += meal.totalMealKcal
        acc.proteins += meal.totalMealProteins
        acc.fibers += meal.totalMealFibers
        acc.salt += meal.totalMealSalt

        acc.carbs.total += meal.totalMealCarbs.total
        acc.carbs.sugars += meal.totalMealCarbs.sugars

        acc.fats.total += meal.totalMealFats.total
        acc.fats.saturated += meal.totalMealFats.saturated

        return acc
    }, {
        kcal: 0, proteins: 0, fibers: 0, salt: 0,
        carbs: { total: 0, sugars: 0 },
        fats: { total: 0, saturated: 0 }
    })

    return {
        kcal: Math.round(summary.kcal),
        proteins: Number(summary.proteins.toFixed(1)),
        fibers: Number(summary.fibers.toFixed(1)),
        salt: Number(summary.salt.toFixed(1)),
        carbs: {
            total: Number(summary.carbs.total.toFixed(1)),
            sugars: Number(summary.carbs.sugars.toFixed(1))
        },
        fats: {
            total: Number(summary.fats.total.toFixed(1)),
            saturated: Number(summary.fats.saturated.toFixed(1))
        },
        water: dailyMetrics ? Number(dailyMetrics.waterAmount.toFixed(2)) : 0,
        weight: activeWeight
    }
}

module.exports ={
    getDailySummary
}