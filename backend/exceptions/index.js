class HttpException extends Error {
    constructor(message, satusCode, error) {
        super(message)
        this.satusCode = satusCode
        this.error = error

    }
}
module.exports = HttpException