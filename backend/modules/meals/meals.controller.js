const MealService = require('./meals.service')
const MealNotFoundException = require('../../exceptions/meals/MealNotFoundException')

const getMeals = async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { date } = req.query

        const meals = await MealService.getMeals(userId, date)

        if (meals.length === 0) {
            return res.status(200)
                .send({
                    statusCode: (200),
                    meals: []
                })
        }

        res.status(200)
            .send({
                statusCode: 200,
                meals
            })
    } catch (e) {
        next(e)
    }
}

const getMealById = async (req, res, next) => {
    try {
        const { id: mealId } = req.params
        const { id: userId } = req.user

        const meal = await MealService.getMealById(mealId, userId)

        if (!meal)
            throw new MealNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                meal
            })
    } catch (e) {
        next(e)
    }
}

const createMeal = async (req, res, next) => {
    try {
        const { body } = req
        body.user = req.user.id

        const meal = await MealService.createMeal(body)

        res.status(201)
            .send({
                statusCode: 201,
                message: 'Meal created successfully',
                meal
            })
    } catch (e) {
        next(e)
    }
}

const addMealItem = async (req, res, next) => {
    try {
        const { id: mealId } = req.params
        const { id: userId } = req.user
        const { body } = req

        const meal = await MealService.addMealItem(mealId, userId, body)

        if (!meal)
            throw new MealNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                message: 'Food added to meal successfully!',
                meal: meal
            })
    } catch (e) {
        console.error("🚨 ERRORE IN ADD ITEM:", e);
        next(e)
    }
}

const editMeal = async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { id: mealId } = req.params
        const { body } = req

        const meal = await MealService.editMeal(mealId, userId, body)

        if (!meal)
            throw new MealNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                message: 'Meal updated successfully'
            })
    } catch (e) {
        next(e)
    }
}

const editMealItem = async (req, res, next) => {
    try {
        const { id: mealId, itemId } = req.params
        const { id: userId } = req.user
        const { consumedQuantity } = req.body

        const meal = await MealService.editMealItem(mealId, itemId, userId, consumedQuantity)

        if (!meal)
            throw new MealNotFoundException()

        res.status(200).send({
            statusCode: 200,
            message: 'Food quantity updated successfully!',
            meal: meal
        })
    } catch (e) {
        next(e)
    }
}

const removeMealItem = async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { id: mealId, itemId } = req.params

        const meal = await MealService.removeMealItem(mealId, itemId, userId)

        if (!meal)
            throw new MealNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                message: 'Food removed from meal successfully!'
            })
    } catch (e) {
        console.log(e)
        next(e)
    }
}

const deleteMeal = async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { id: mealId } = req.params

        const meal = await MealService.deleteMeal(mealId, userId)

        if (!meal)
            throw new MealNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                message: 'meal deleted successfully'
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getMeals,
    getMealById,
    createMeal,
    addMealItem,
    editMeal,
    editMealItem,
    removeMealItem,
    deleteMeal
}