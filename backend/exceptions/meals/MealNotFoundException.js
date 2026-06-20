const HttpException= require('../index')

class MealNotFoundException extends HttpException{
    constructor(
        message = 'No Meal Found',
        statusCode  = '404',
        error = 'The requested resource is not found'
    ){
        super(message, statusCode, error)
    }
}

module.exports = MealNotFoundException