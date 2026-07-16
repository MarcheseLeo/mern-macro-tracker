const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../users/user.schema')
const Notification = require('../notifications/notifications.service')
const InvalidCredentialsException = require('../../exceptions/auth/InvalidCredentialsException')
const UserNotVerifiedException = require('../../exceptions/users/UserNotVerifiedException')

const login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        throw new InvalidCredentialsException()
    }

    if (!user.isVerified) {
        throw new UserNotVerifiedException()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new InvalidCredentialsException()
    }
    
    await Notification.createLoginNotification(user._id)
    

    const accessToken = jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' })

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    )

    return {
        accessToken,
        refreshToken
    }
}

const verifyEmail = async (token) => {
    const user = await User.findOne({ verificationToken: token })

    if (!user)
        return null

    user.isVerified = true
    user.verificationToken = undefined

    await Notification.createRegisterNotification(user._id)
    await user.save()
    return user
}

const register = async (body) => {
    const newUser = new User(body)
    return await newUser.save()
}
module.exports = {
    login,
    register,
    verifyEmail
}