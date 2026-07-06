const UserSchema = require('./user.schema')
const MealSchema = require('../meals/meals.schema')
const bcrypt = require('bcrypt')
const InvalidCredentialExcpetion = require('../../exceptions/auth/InvalidCredentialsException')

const getUsers = async () => {
    return await UserSchema.find()
}

const getUserById = async (id) => {
    return await UserSchema.findById(id)
}

const editUser = async (id, body) => {
    const updateQuery = { ...body }
    if (body.weight) {
        delete updateQuery.weight
        updateQuery.$push = {
            weightHistory: {
                weight: body.weight,
                date: new Date()
            }
        }
    }
    const updatedUser = await UserSchema.findByIdAndUpdate(id, updateQuery, { returnDocument: 'after' })
    return updatedUser
}

const updatePassword = async (id, oldPassword, newPassword) => {
    const user = await UserSchema.findById(id).select('+password')
    if (!user)
        return null

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid) {
        throw new InvalidCredentialExcpetion('Old password is not correct', 401, 'The provided password doesnt match')
    }

    if (newPassword === oldPassword) {
        throw new InvalidCredentialExcpetion('New password cant be tha same of old password', 401, 'Passwords cant be the same')
    }
    const updatedUser = await UserSchema.findByIdAndUpdate(
        id,
        { password: newPassword },
        { returnDocument: 'after' }
    );
    return updatedUser
}

const deleteUser = async (id) => {
    await MealSchema.deleteMany({ user: id })
    return await UserSchema.findByIdAndDelete(id)
}

module.exports = {
    getUsers,
    getUserById,
    editUser,
    updatePassword,
    deleteUser
}