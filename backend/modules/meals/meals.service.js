const MealSchema = require('./meals.schema')
const UserSchema = require('../users/user.schema')

const getMeals = async (userId, dateString = null) => {
    const filter = { user: userId }

    if (dateString) {
        const startOfDay = new Date(dateString)
        startOfDay.setUTCHours(0, 0, 0, 0)

        const endOfDay = new Date(dateString)
        endOfDay.setUTCHours(23, 59, 59, 999)

        filter.date = { $gte: startOfDay, $lte: endOfDay }
    }

    return await MealSchema.find(filter).populate([
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues category'
        }
    ])
        .sort({ date: -1 })
}

const getMealById = async (mealId, userId) => {
    return await MealSchema.findOne({ _id: mealId, user: userId }).populate([
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues category'
        }
    ])
}

const createMeal = async (body) => {
    const { user, mealType, date, items } = body

    const userToUpdate = await UserSchema.findById(user)

    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = new Date(targetDate)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setUTCHours(23, 59, 59, 999)

    if (userToUpdate) {
        const todayMs = startOfDay.getTime()
        const lastActiveMs = userToUpdate.lastActiveDate ? userToUpdate.lastActiveDate.getTime() : 0

        const diffTime = Math.abs(todayMs - lastActiveMs)
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
            userToUpdate.currentStreak += 1;
        } else if (diffDays > 1 || lastActiveMs === 0) {
            userToUpdate.currentStreak = 1;
        }

        userToUpdate.lastActiveDate = startOfDay;
        await userToUpdate.save()
    }


    let existingMeal = await MealSchema.findOne({
        user: user,
        mealType: mealType,
        date: { $gte: startOfDay, $lte: endOfDay }
    })

    if (existingMeal) {
        existingMeal.items.push(...items)
        await existingMeal.save()

        return await existingMeal.populate({
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues category'
        })
    }

    const newMeal = new MealSchema({
        ...body,
        date: startOfDay
    })
    await newMeal.save()

    return await newMeal.populate([
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues category'
        }
    ])

}

const addMealItem = async (mealId, userId, itemData) => {
    const meal = await MealSchema.findOne({ _id: mealId, user: userId })

    if (!meal)
        return null

    if (!meal.items) {
        meal.items = [];
    }

    meal.items.push(itemData)
    await meal.save()

    return await meal.populate({
        path: 'items.foodId',
        select: 'name brand servingSize servingUnit nutritionalValues category'
    })
}

const editMeal = async (mealId, userId, body) => {
    const updatedMeal = await MealSchema.findOneAndUpdate({ _id: mealId, user: userId }, body, { new: true, runValidators: true })
    if (!updatedMeal) {
        return null
    }
    return updatedMeal.populate([
        {
            path: 'items.foodId',
            select: 'name brand servingSize servingUnit nutritionalValues category'
        }
    ])
}

const removeMealItem = async (mealId, itemId, userId) => {
    const meal = await MealSchema.findOneAndUpdate(
        { _id: mealId, user: userId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
    ).populate({
        path: 'items.foodId',
        select: 'name brand servingSize servingUnit nutritionalValues category'
    })

    return meal
}

const deleteMeal = async (mealId, userId) => {
    return await MealSchema.findOneAndDelete({ _id: mealId, user: userId })
}


module.exports = {
    getMeals,
    getMealById,
    createMeal,
    addMealItem,
    editMeal,
    removeMealItem,
    deleteMeal
}