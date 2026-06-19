const express = require('express')
const {foodBodyValidation, foodBodyValidator} = require('../../middlewares/foods/validateFoodBody')
const foods = express.Router()
const foodController = require('./foods.controller')

//GET
foods.get('/', foodController.getFoods)
foods.get('/:id', foodController.getFoodById)

//POST
foods.post('/',[foodBodyValidation, foodBodyValidator] ,foodController.createFood)

//PUT
foods.put('/:id', foodController.editFood)

//DELETE
foods.delete('/:id', foodController.deleteFood)

module.exports = foods
