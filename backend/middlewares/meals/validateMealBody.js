const { body, validationResult } = require('express-validator')

const mealBodyValidation = [
    body('user')
        .notEmpty()
        .isMongoId()
        .withMessage('user must be a valid user MongoDb ObjectId'),
    body('mealType')
        .notEmpty()
        .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
        .withMessage('mealType must be breakfast, lunch, dinner or snack'),
    body('date')
        .optional()
        .isISO8601().toDate()
        .withMessage('date must be a valid date'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('items must be a non-empty array'),
    body('items.*.foodId')
        .notEmpty()
        .isMongoId()
        .withMessage('foodId must be a valid MongoDB ObjectId'),
    body('items.*.consumedQuantity')
        .notEmpty()
        .isFloat({ min: 1 })
        .withMessage('consumedQuantity must be a number greater than or equal to 1')

]

const mealBodyValidator = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400)
            .json({
                errors: errors.array()
            })
    }
    next()
}

module.exports = {
    mealBodyValidation,
    mealBodyValidator
}