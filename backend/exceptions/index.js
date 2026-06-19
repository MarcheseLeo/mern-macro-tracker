class HttpException extends Error {
    constructor(message, statusCode, error) {
        super(message)
        this.statusCode = satusCode
        this.error = error

    }
}
module.exports = HttpException