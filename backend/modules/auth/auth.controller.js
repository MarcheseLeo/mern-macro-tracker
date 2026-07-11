const AuthService = require('./auth.service')
const crypto = require('crypto')
const EmailService = require('../email/email.service')
const jwt = require('jsonwebtoken')
const User = require('../users/user.schema')
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const { accessToken: token, refreshToken } = await AuthService.login(email, password)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })

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

const refreshToken = async (req, res, next) => {
    try {
        const rfToken = req.cookies?.refreshToken;

        if (!rfToken) return res.status(401).send({ message: "Nessun refresh token trovato" });

        

        const decoded = jwt.verify(rfToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) return res.status(401).send({ message: "Utente non valido" });

        const newAccessToken = jwt.sign({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });

        res.status(200).send({ token: newAccessToken });
    } catch (e) {
        res.status(401).send({ message: "Refresh token not valid or expired" });
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

const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).send({ message: "Logout effettuato" });
}

module.exports = {
    login,
    register,
    verifyEmail,
    refreshToken, 
    logout
}