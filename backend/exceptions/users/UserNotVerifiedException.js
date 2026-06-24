const HttpException= require('../index')

class UserNotVerifiedException extends HttpException{
    constructor(
        message = 'Verify your email first! Check your mailbox',
        statusCode  = 404,
        error = 'User not verified'
    ){
        super(message, statusCode, error)
    }
}

module.exports = UserNotVerifiedException