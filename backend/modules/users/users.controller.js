const UserService = require('./users.service')
const UserNotFoundException = require('../../exceptions/users/UserNotFoundException')

const getMe = async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await UserService.getUserById(id)

        if (!user)
            throw new UserNotFoundException()

        res.status(200)
            .send(user)

    } catch (e) {
        next(e)
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await UserService.getUsers()

        if (users.length === 0) {
            return res.status(200)
                .send({
                    statusCode: 200,
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
        const user = await UserService.getUserById(id)

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

const editMe = async (req, res, next) => {
    try{
        const {id} = req.user
        const {body} = req
        const user = await UserService.editUser(id,body)

        if(!user)
            throw new UserNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                message: 'User updated successfully',
                user
            })
    }catch(e){
        next(e)
    }
}

const editUser = async (req, res, next) => {
    try {
        const { body } = req
        const { id } = req.params

        const user = await UserService.editUser(id, body)

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

        const user = await UserService.deleteUser(id)

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
    getMe,
    getUsers,
    getUserById,
    editMe,
    editUser,
    deleteUser
}