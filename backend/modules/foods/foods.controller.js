const foodService = require('./foods.service')
const FoodNotFoundException = require('../../exceptions/foods/FoodNotFoundException')

const getFoods = async (req, res, next) => {
    try {
        const { name } = req.query
        const foods = await foodService.getFoods(name)

        if (foods.length === 0) {
            return res.status(200)
                .send({
                    statusCode: 200,
                    foods: []
                })
        }

        res.status(200)
            .send({
                statusCode: 200,
                foods
            })
    } catch (e) {
        next(e)
    }
}

const getFoodById = async (req, res, next) => {
    try {
        const { id } = req.params
        const food = await foodService.getFoodById(id)

        if (!food) {
            throw new FoodNotFoundException()
        }

        res.status(200)
            .send({
                statusCode: 200,
                food
            })
    } catch (e) {
        next(e)
    }
}

const createFood = async (req, res, next) => {
    try {
        const { body } = req
        const food = await foodService.createFood(body)

        if (!food) {
            throw new FoodNotFoundException()
        }

        res.status(201)
            .send({
                statusCode: 201,
                message: 'Food created successfully',
                food
            })
    } catch (e) {
        next(e)
    }
}

const editFood = async (req, res, next) => {
    try {
        const { body } = req
        const { id } = req.params
        const food = await foodService.editFood(id, body)

        if (!food) {
            throw new FoodNotFoundException()
        }

        res.status(200)
            .send({
                statusCode: 200,
                message: 'Food updated successfully',
                food
            })
    } catch (e) {
        next(e)
    }
}

const deleteFood = async (req, res, next) => {
    try {
        const { id } = req.params
        const food = await foodService.deleteFood(id)

        if (!food) {
            throw new FoodNotFoundException()
        }

        res.status(200)
            .send({
                statusCode: 200,
                message: 'Food deleted successfully'
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    editFood,
    deleteFood
}