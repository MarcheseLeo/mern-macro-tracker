const express = require('express')
const MealsController = require('./meals.controller')
const {mealBodyValidation, mealBodyValidator} = require('../../middlewares/meals/validateMealBody')
const meals = express.Router()

//GET
meals.get('/', MealsController.getMeals)
meals.get('/:id', MealsController.getMealById)

//POST
meals.post('/',[mealBodyValidation, mealBodyValidator] ,MealsController.createMeal)

//PUT       
meals.put('/:id', MealsController.editMeal)

//DELETE
meals.delete('/:id', MealsController.deleteMeal)


module.exports = meals