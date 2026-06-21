const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Users = require('../users/user.schema')
const InvalidCredentialsException = require('../../exceptions/auth/InvalidCredentialsException')

const login = async (email, password) => {
    const user = await Users.findOne({ email }).select('+password')

    if (!user) {
        throw new InvalidCredentialsException()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new InvalidCredentialsException()
    }

    const token = jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

    return {
        token
    }
}

module.exports = {
    login
}