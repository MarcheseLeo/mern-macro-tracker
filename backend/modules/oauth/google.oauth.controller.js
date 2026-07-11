const jwt = require('jsonwebtoken')

const manageOauthCallback = async (req, res, next) => {
    try {
        const accessToken = jwt.sign(
            { id: req.user._id, firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
        )

        const refreshToken = jwt.sign(
            { id: req.user._id },
            process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const redirectUrl = `${process.env.FRONTEND_URL}/oauth/success?token=${accessToken}`
        res.redirect(redirectUrl)
    } catch (e) {
        next(e)
    }
}

module.exports = {
    manageOauthCallback
}