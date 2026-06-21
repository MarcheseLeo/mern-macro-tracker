const UserSchema = require('./user.schema')

const getUsers = async () => {
    return await UserSchema.find()
}

const getUserById = async (id) => {
    return await UserSchema.findById(id)
}

const createUser = async (body) => {
    const newUser = new UserSchema(body)
    return await newUser.save()
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
    createUser,
    editUser,
    deleteUser
}