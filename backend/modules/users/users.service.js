const userSchema = require('./user.schema')

const getUsers = async () => {
    return await userSchema.find()
}

const getUserById = async (id) => {
    return await userSchema.findById(id)
}

const createUser = async (body) => {
    const newUser = new userSchema(body)
    return await newUser.save()
}

const editUser = async (id, body) => {
    const updatedUser = await userSchema.findByIdAndUpdate(id, body, { new: true })
    return updatedUser
}

const deleteUser = async(id) =>{
    const  userToDelete = await userSchema.findByIdAndDelete(id)
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser
}