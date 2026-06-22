const { body, validationResult } = require('express-validator')

const foodBodyValidation = [
    body('name')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('name must be a string and not empty')
        .isLength({ min: 2, max: 100 })
        .withMessage('name must be a string between 2 and 100 characters'),
    body('brand')
        .optional()
        .trim()
        .isString()
        .withMessage('brand must be a string'),
    body('servingSize')
        .notEmpty()
        .isFloat({ min: 1 })
        .withMessage('servingSize must be a positive number'),
    body('servingUnit')
        .optional()
        .isIn(['g', 'ml'])
        .withMessage('servingUnit must be g or ml'),
    body('nutritionalValues.kcal')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('kcal must be a positive number'),
    body('nutritionalValues.fats.total')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('total fats must be a positive number'),
    body('nutritionalValues.fats.saturated')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('saturated fats must be a positive number'),
    body('nutritionalValues.carbs.total')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('total carbs must be a positive number'),
    body('nutritionalValues.carbs.sugars')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('sugars must be a positive number'),
    body('nutritionalValues.proteins')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('proteins must be a positive number'),
    body('nutritionalValues.fibers')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('fibers must be a positive number'),
    body('nutritionalValues.salt')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('salt must be a positive number'),
    body('barcode')
        .optional()
        .isEAN()
        .withMessage('barcode must be an EAN code'),
    body('source')
        .optional()
        .isIn(['user', 'openfoodfacts', 'admin'])
        .withMessage('source must be user, openfoodfacts or admin'),
    body('category')
        .optional()
        .isIn(['fruit', 'vegetable', 'meat', 'dairy', 'cereal', 'snack', 'beverage', 'other'])
        .withMessage('category is not valid'),
    body('nutritionBasis')
        .optional()
        .isIn(['per_100', 'per_serving'])
        .withMessage('nutritionBasis must be per_100 or per_serving'),
]

const editFoodValidation = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .isString()
        .withMessage('name must be a string and not empty')
        .isLength({ min: 2, max: 100 })
        .withMessage('name must be a string between 2 and 100 characters'),
    body('brand')
        .optional()
        .trim()
        .isString()
        .withMessage('brand must be a string'),
    body('servingSize')
        .optional()
        .isFloat({ min: 1 })
        .withMessage('servingSize must be a positive number'),
    body('servingUnit')
        .optional()
        .isIn(['g', 'ml'])
        .withMessage('servingUnit must be g or ml'),
    body('nutritionalValues')
        .optional()
        .isObject()
        .withMessage('nutritionalValues must be an object'),
    body('nutritionalValues.kcal')
        .if(body('nutritionalValues').exists())
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('kcal must be a positive number'),
    body('nutritionalValues.fats.total')
        .if(body('nutritionalValues').exists())
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('total fats must be a positive number'),
    body('nutritionalValues.fats.saturated')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('saturated fats must be a positive number'),
    body('nutritionalValues.carbs.total')
        .if(body('nutritionalValues').exists())
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('total carbs must be a positive number'),
    body('nutritionalValues.carbs.sugars')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('sugars must be a positive number'),
    body('nutritionalValues.proteins')
        .if(body('nutritionalValues').exists())
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('proteins must be a positive number'),
    body('nutritionalValues.fibers')
        .if(body('nutritionalValues').exists())
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('fibers must be a positive number'),
    body('nutritionalValues.salt')
        .if(body('nutritionalValues').exists())
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('salt must be a positive number'),
    body('barcode')
        .optional()
        .isEAN()
        .withMessage('barcode must be an EAN code'),
    body('source')
        .optional()
        .isIn(['user', 'openfoodfacts', 'admin'])
        .withMessage('source must be user, openfoodfacts or admin'),
    body('category')
        .optional()
        .isIn(['fruit', 'vegetable', 'meat', 'dairy', 'cereal', 'snack', 'beverage', 'other'])
        .withMessage('category is not valid'),
    body('nutritionBasis')
        .optional()
        .isIn(['per_100', 'per_serving'])
        .withMessage('nutritionBasis must be per_100 or per_serving'),
]

const foodBodyValidator = (req, res, next) => {
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
    foodBodyValidation,
    editFoodValidation,
    foodBodyValidator
}