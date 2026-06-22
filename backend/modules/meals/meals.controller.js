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
        const { id } = req.params
        const { id: userId } = req.user

        const meal = await MealService.getMealById(id, userId)

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

const editMeal = async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { id } = req.params
        const { body } = req

        const meal = await MealService.editMeal(id, body, userId)

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

const deleteMeal = async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { id } = req.params

        const meal = await MealService.deleteMeal(id, userId)

        if(!meal)
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
    editMeal,
    deleteMeal
}