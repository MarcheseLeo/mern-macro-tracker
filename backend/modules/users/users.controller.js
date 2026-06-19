const userService = require('./users.service')

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers()

        if (users.length === 0) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No user found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                users
            })
    } catch (e) {
        res.status(500)
            .send({
                statusCode: 500,
                message: 'Error during user request',
                error: e.message
            })
    }
}
const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userService.getUserById(id)

        if (!user) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No user found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                user
            })
    } catch (e) {
        res.status(500)
            .send({
                statusCode: 500,
                message: 'Error during user request',
                error: e.message
            })
    }
}

const createUser = async (req, res) => {
    try {
        const { body } = req
        const user = await userService.createUser(body)

        if (!user) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No user found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'New user created successfully',
                user
            })
    } catch (e) {
        res.status(500)
            .send({
                statusCode: 500,
                message: 'Error during user request',
                error: e.message
            })
    }
}

const editUser = async (req, res) => {
    try {
        const { body } = req
        const { id } = req.params

        const user = await userService.editUser(id, body)

        if (!user) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No user found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'New user created successfully',
                user
            })
    } catch (e) {
        res.status(500)
            .send({
                statusCode: 500,
                message: 'Error during user request',
                error: e.message
            })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await userService.deleteUser(id)

        if (!user) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'No user found'
                })
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'New user created successfully',
                user
            })
    } catch (e) {
        res.status(500)
            .send({
                statusCode: 500,
                message: 'Error during user request',
                error: e.message
            })
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser
}