const HttpException= require('../index')

class InvalidOrMissingTokenException extends HttpException{
    constructor(
        message = 'Token error',
        statusCode  = 401,
        error = 'Invalid or missing token'
    ){
        super(message, statusCode, error)
    }
}

module.exports = InvalidOrMissingTokenException