const HttpException = require('../../exceptions/index')
const mongoose = require('mongoose')

const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpException) {
        return res.status(err.statusCode)
            .json({
                statusCode: err.statusCode,
                message: err.message,
                error: err.error
            })
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'Mongoose Error: object id is invalid or malformed'
            })
    }

    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(err.statusCode || 400)
            .json({
                statusCode: err.statusCode || 400,
                message: 'Mongoose Error: one ore more passed or required props failed the validation',
                error: err.errors
            })
    }

    if (err.code === 11000) {
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'Mongoose Error: duplicate key error'
            })
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Invalid JSON body'
        })
    }

    if (err.name === 'MongoServerSelectionError') {
        return res.status(503).json({
            statusCode: 503,
            message: 'Database connection error'
        })
    }

    if (err.name === 'DocumentNotFoundError') {
        return res.status(404).json({
            statusCode: 404,
            message: 'Document not found'
        })
    }

    res.status(500)
        .json({
            statusCode: 500,
            message: "Internal Server error",
            error: "An error has occurred"
        })
}

module.exports = errorHandler
