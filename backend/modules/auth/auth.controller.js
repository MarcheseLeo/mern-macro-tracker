const AuthService = require('./auth.service')
const crypto = require('crypto')
const EmailService = require('../email/email.service')

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const { token } = await AuthService.login(email, password)

        res.header('authorization', token)
            .status(200)
            .send({
                statusCode: 200,
                message: "Login successfully",
                token
            })
    } catch (e) {
        next(e)
    }
}

const register = async (req, res, next) => {
    try {
        const { body } = req

        const token = crypto.randomBytes(32).toString('hex')

        body.isVerified = false
        body.verificationToken = token

        const user = await AuthService.register(body)

        await EmailService.sendVerificationEmail(body.email, token)

        res.status(201)
            .send({
                statusCode: 201,
                message: 'User registered successfully',
                user
            })
    } catch (e) {
        console.error("🚨 ERRORE IN REGISTRAZIONE:", e);
        next(e)
    }
}

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400)
                .send({
                    message: 'Missing token'
                })
        }
        const user = await AuthService.verifyEmail(token)

        if (!user) {
            return res.status(400)
                .send({
                    message: 'Expired or not valid token'
                })
        }

        res.status(200)
            .send({
                message: 'Email verified successfully! Now you can login'
            })

    } catch (e) {
        next(e)
    }
}

module.exports = {
    login,
    register,
    verifyEmail
}