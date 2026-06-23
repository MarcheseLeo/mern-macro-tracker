const HttpException= require('../index')

class FoodNotFoundException extends HttpException{
    constructor(
        message = 'No product Found',
        statusCode  = 404,
        error = 'The requested resource is not found'
    ){
        super(message, statusCode, error)
    }
}

module.exports = FoodNotFoundException