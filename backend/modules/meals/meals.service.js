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
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues '
        }
    ])
        .sort({ date: -1 })
}

const getMealById = async (id, userId) => {
    return await MealSchema.findOne({ _id: id, user: userId }).populate([
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues'
        }
    ])
}

const createMeal = async (body) => {
    const newMeal = new MealSchema(body)
    await newMeal.save()

    return await newMeal.populate([
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues'
        }
    ])

}

const editMeal = async (id, body, userId) => {
    const updatedMeal = await MealSchema.findOneAndUpdate({ _id: id, user: userId }, body, { new: true, runValidators: true })
    if (!updatedMeal) {
        return null
    }
    return updatedMeal.populate([
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues'
        }
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