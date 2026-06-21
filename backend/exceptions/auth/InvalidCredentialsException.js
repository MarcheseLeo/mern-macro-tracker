const HttpException= require('../index')

class InvalidCredentialsException extends HttpException{
    constructor(
        message = 'Invalid credential',
        statusCode  = 401,
        error = 'The provided credential are not valid'
    ){
        super(message, statusCode, error)
    }
}

module.exports = InvalidCredentialsException