const UserSchema = require('./user.schema')

const getUsers = async () => {
    return await UserSchema.find()
}

const getUserById = async (id) => {
    return await UserSchema.findById(id)
}

const editUser = async (id, body) => {
    const updatedUser = await UserSchema.findByIdAndUpdate(id, body, { new: true })
    return updatedUser.select('-password')
}

const deleteUser = async(id) =>{
    return await UserSchema.findByIdAndDelete(id)
}

module.exports = {
    getUsers,
    getUserById,
    editUser,
    deleteUser
}