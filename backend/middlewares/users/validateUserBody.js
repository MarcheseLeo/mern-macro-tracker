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
        .isISO8601().toDate()
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
    body('weight')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('weight must be a positive number'),
    body('height')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('height must be a positive number'),
    body('dailyKcalGoal')
        .optional()
        .isInt({ min: 1 })
        .withMessage('dailyKcalGoal must be a positive integer'),
    body('macroGoals.carbs')
        .optional()
        .isInt({ min: 1 })
        .withMessage('macroGoals.carbs must be a positive integer in grams'),
    body('macroGoals.proteins')
        .optional()
        .isInt({ min: 1 })
        .withMessage('macroGoals.protein must be a positive integer in grams'),
    body('macroGoals.fats')
        .optional()
        .isInt({ min: 1 })
        .withMessage('macroGoals.fat must be a positive integer in grams'),
    body('avatar')
        .optional()
        .isString()
        .isURL()
        .withMessage('avatar must be a valid url'),
    body('isVerified')
        .not().exists()
        .withMessage('Cannot set isVerified from this route'),
    body('verificationToken')
        .not().exists()
        .withMessage('Cannot set verificationToken from this route'),
]

const editUserValidation = [
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('firstName must be a string and not empty'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('lastName must be a string and not empty'),
    body('email')
        .optional()
        .isEmail()
        .notEmpty()
        .withMessage('email must be a valid email'),
    body('password')
        .not().exists()
        .withMessage('Cannot update password from this route. Please use /me/password'),
    body('googleId')
        .optional()
        .isString()
        .withMessage('googleId must be a string'),
    body('dob')
        .optional()
        .isISO8601().toDate()
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
    body('weight')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('weight must be a positive number'),
    body('height')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('height must be a positive number'),
    body('dailyKcalGoal')
        .optional()
        .isInt({ min: 1 })
        .withMessage('dailyKcalGoal must be a positive integer'),
    body('macroGoals.carbs')
        .optional()
        .isInt({ min: 1 })
        .withMessage('macroGoals.carbs must be a positive integer in grams'),
    body('macroGoals.proteins')
        .optional()
        .isInt({ min: 1 })
        .withMessage('macroGoals.protein must be a positive integer in grams'),
    body('macroGoals.fats')
        .optional()
        .isInt({ min: 1 })
        .withMessage('macroGoals.fat must be a positive integer in grams'),
    body('avatar')
        .optional()
        .isString()
        .isURL()
        .withMessage('avatar must be a valid url'),
    body('isVerified')
        .not().exists()
        .withMessage('Cannot update isVerified from this route'),
    body('verificationToken')
        .not().exists()
        .withMessage('Cannot update verificationToken from this route'),
]

const changePasswordValidation = [
    body('oldPassword')
        .exists()
        .withMessage('oldPassword is required')
        .isString()
        .notEmpty(),
    body('newPassword')
        .exists()
        .withMessage('newPassword is required')
        .isString()
        .isLength({ min: 8 })
        .withMessage('newPassword must be a string with at least 8 characters')
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
    editUserValidation,
    changePasswordValidation,
    userBodyValidator
}
