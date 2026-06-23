const express = require('express')
const {foodBodyValidation, editFoodValidation , foodBodyValidator} = require('../../middlewares/foods/validateFoodBody')
const foods = express.Router()
const FoodController = require('./foods.controller')
const OpenFoodFactsController = require('../open-food-facts/openFoodFacts.controller')


//GET
foods.get('/import/barcode/:barcode', OpenFoodFactsController.getProductByBarcode)

foods.get('/', FoodController.getFoods)
foods.get('/:id', FoodController.getFoodById)

//POST
foods.post('/',[foodBodyValidation, foodBodyValidator] ,FoodController.createFood)

//PATCH
foods.patch('/:id',[editFoodValidation, foodBodyValidator] ,FoodController.editFood)

//DELETE
foods.delete('/:id', FoodController.deleteFood)

module.exports = foods
