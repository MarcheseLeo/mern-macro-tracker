const express = require('express')
const MealsController = require('./meals.controller')
const {mealBodyValidation, editMealValidation, mealBodyValidator} = require('../../middlewares/meals/validateMealBody')
const meals = express.Router()

//GET
meals.get('/', MealsController.getMeals)
meals.get('/:id', MealsController.getMealById)

//POST
meals.post('/',[mealBodyValidation, mealBodyValidator] ,MealsController.createMeal)

//PATCH       
meals.patch('/:id', [editMealValidation, mealBodyValidator], MealsController.editMeal)

//DELETE
meals.delete('/:id', MealsController.deleteMeal)


module.exports = meals