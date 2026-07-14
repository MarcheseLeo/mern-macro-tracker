const AuthService = require('./auth.service')
const crypto = require('crypto')
const EmailService = require('../email/email.service')
const jwt = require('jsonwebtoken')
const User = require('../users/user.schema')
const UserNotFoundException = require('../../exceptions/users/UserNotFoundException')
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
        try {
            await EmailService.sendWelcomeEmail(user.email, user.firstName)
        } catch (emailError) {
            console.error("Errore invio email di benvenuto:", emailError)
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


const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new UserNotFoundException('No user found linked to the specified email')

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        await EmailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);
        
        res.status(200).send({ message: "Password reset link sent to your email." });
    } catch (e) {
        next(e);
    }
}


const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).send({ message: "Token is invalid or has expired." })

        user.password = newPassword;
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.status(200).send({ message: "Password successfully updated. You can now log in." })
    } catch (e) {
        next(e);
    }
}

module.exports = {
    login,
    register,
    verifyEmail,
    refreshToken, 
    logout,
    forgotPassword,
    resetPassword
}