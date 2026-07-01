const FoodService = require('./foods.service')
const FoodNotFoundException = require('../../exceptions/foods/FoodNotFoundException')

const getFoods = async (req, res, next) => {
    try {
        const { name, category, page = 1, limit = 15 } = req.query
        const result = await FoodService.getFoods({ name, category, page, limit })


        res.status(200)
            .send({
                statusCode: 200,
                ...result
            })
    } catch (e) {
        next(e)
    }
}

const getFoodById = async (req, res, next) => {
    try {
        const { id } = req.params
        const food = await FoodService.getFoodById(id)

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
        const food = await FoodService.createFood(body)

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
        const food = await FoodService.editFood(id, body)

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
        const food = await FoodService.deleteFood(id)

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