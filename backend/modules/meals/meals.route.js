const express = require('express')
const MealsController = require('./meals.controller')
const {mealBodyValidation,mealItemValidation ,editMealValidation, mealBodyValidator} = require('../../middlewares/meals/validateMealBody')
const meals = express.Router()

//GET
meals.get('/', MealsController.getMeals)
meals.get('/summary/daily', MealsController.getDailySummary)
meals.get('/:id', MealsController.getMealById)

//POST
meals.post('/',[mealBodyValidation, mealBodyValidator] ,MealsController.createMeal)
meals.post('/:id/items', [mealItemValidation, mealBodyValidator], MealsController.addMealItem)

//PATCH       
meals.patch('/:id', [editMealValidation, mealBodyValidator], MealsController.editMeal)

//DELETE
meals.delete('/:id', MealsController.deleteMeal)
meals.delete('/:id/items/:itemId', MealsController.removeMealItem)

module.exports = meals