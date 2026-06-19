const { body, validationResult } = require('express-validator')

const userBodyValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('firstName must be a string and not empty'),
    body('lastName')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('lastName must be a string and not empty'),
    body('email')
        .isEmail()
        .notEmpty()
        .withMessage('email must be a valid email'),
    body('password')
        .if(body('googleId').not().exists())
        .isLength({ min: 8 })
        .isString()
        .withMessage('password must be a string with at least 8 characters'),
    body('googleId')
        .optional()
        .isString()
        .withMessage('googleId must be a string'),
    body('dob')
        .optional()
        .isISO8601()
        .toDate()
        .custom(value => {
            if (value > new Date()) {
                throw new Error('dob cannot be in the future')
            }
            return true
        })
        .withMessage('date must be a valid date'),
    body('gender')
        .optional()
        .isIn(['male', 'female', 'not specified'])
        .withMessage('gender must be male, female or not specified'),
    body('height')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('height must be a positive number'),
    body('dailyKcalGoal')
        .optional()
        .isInt({ min: 1 })
        .withMessage('dailyKcalGoal must be a positive integer')
]

const userBodyValidator = (req, res, next) => {
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
    userBodyValidation,
    userBodyValidator
}
