const UserSchema = require('./user.schema')
const MealSchema = require('../meals/meals.schema')
const DailyMetricSchema = require('../daily-metrics/dailyMetrics.schema')
const bcrypt = require('bcrypt')
const InvalidCredentialExcpetion = require('../../exceptions/auth/InvalidCredentialsException')

const getUsers = async () => {
    return await UserSchema.find()
}

const getUserById = async (id) => {
    return await UserSchema.findById(id)
}

const editUser = async (id, body) => {
    const user = await UserSchema.findById(id);
    if (!user) return null;

    if (body.weight) {
        const targetDate = body.date ? new Date(body.date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const existingEntryIndex = user.weightHistory.findIndex(entry => 
            entry.date >= startOfDay && entry.date <= endOfDay
        )

        if (existingEntryIndex !== -1) {
            user.weightHistory[existingEntryIndex].weight = body.weight;
        } else {
            user.weightHistory.push({
                weight: body.weight,
                date: targetDate
            })
        }

        delete body.weight;
        delete body.date;
    }

    Object.assign(user, body);
    await user.save();
    
    return user;
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
    await DailyMetricSchema.deleteMany({ user: id })
    return await UserSchema.findByIdAndDelete(id)
}

module.exports = {
    getUsers,
    getUserById,
    editUser,
    updatePassword,
    deleteUser
}