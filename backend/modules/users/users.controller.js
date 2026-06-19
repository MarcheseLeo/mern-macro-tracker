const userService = require('./users.service')
const UserNotFoundException = require('../../exceptions/users/UserNotFoundException')

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers()

        if (users.length === 0) {
            return res.status(200)
                .send({
                    statusCode:200,
                    users: []
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                users
            })
    } catch (e) {
        next(e)
    }
}
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await userService.getUserById(id)

        if (!user) {
            throw new UserNotFoundException()
        }
        res.status(200)
            .send({
                statusCode: 200,
                user
            })
    } catch (e) {
        next(e)
    }
}

const createUser = async (req, res, next) => {
    try {
        const { body } = req
        const user = await userService.createUser(body)

        if (!user) {
            throw new UserNotFoundException()
        }
        res.status(201)
            .send({
                statusCode: 201,
                message: 'New user created successfully',
                user
            })
    } catch (e) {
        next(e)
    }
}

const editUser = async (req, res, next) => {
    try {
        const { body } = req
        const { id } = req.params

        const user = await userService.editUser(id, body)

        if (!user) {
            throw new UserNotFoundException()
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'User updated successfully',
                user
            })
    } catch (e) {
        next(e)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params

        const user = await userService.deleteUser(id)

        if (!user) {
            throw new UserNotFoundException()
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'User deleted successfully',
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser
}