const { body, validationResult } = require('express-validator');

const updateWaterValidation = [
    body('date')
        .optional()
        .isISO8601().toDate()
        .withMessage('date must be a valid date'),
    
    body('amount')
        .exists()
        .withMessage('amount is required')
        .isFloat()
        .withMessage('amount must be a number')
];

const dailyMetricValidator = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};

module.exports = {
    updateWaterValidation,
    dailyMetricValidator
};