const MealSchema = require('./meals.schema')

const getMeals = async (userId, dateString = null) => {
    const filter = { user: userId }

    if (dateString) {
        const startOfDay = new Date(dateString)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(dateString)
        endOfDay.setHours(23, 59, 59, 999)

        filter.date = { $gte: startOfDay, $lte: endOfDay }
    }

    return await MealSchema.find(filter).populate([
        { path: 'user', select: 'firstName lastName gender height dailyKcalGoal' },
        { path: 'items.foodId' }
    ])
        .sort({ date: -1 })
}

const getMealById = async (id, userId) => {
    return await MealSchema.findOne({ _id: id, user: userId }).populate([
        { path: 'user', select: 'firstName lastName gender height dailyKcalGoal' },
        { path: 'items.foodId' }
    ])
}

const createMeal = async (body) => {
    const newMeal = new MealSchema(body)
    await newMeal.save()

    return await newMeal.populate([
        { path: 'user', select: 'firstName lastName gender height dailyKcalGoal' },
        { path: 'items.foodId' }
    ])

}

const editMeal = async (id, body, userId) => {
    const updatedMeal = await MealSchema.findOneAndUpdate({ _id: id, user: userId }, body, { new: true, runValidators: true })
    if (!updatedMeal) {
        return null
    }
    return updatedMeal.populate([
        { path: 'user', select: 'firstName lastName gender height dailyKcalGoal' },
        { path: 'items.foodId' }
    ])
}

const deleteMeal = async (id, userId) => {
    return await MealSchema.findOneAndDelete({ _id: id, user: userId })
}


module.exports = {
    getMeals,
    getMealById,
    createMeal,
    editMeal,
    deleteMeal
}