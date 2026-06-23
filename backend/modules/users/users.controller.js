const UserService = require('./users.service')
const UserNotFoundException = require('../../exceptions/users/UserNotFoundException')
const cloudinary = require('cloudinary').v2
const pc =  require('picocolors')

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
    try {
        const { id } = req.user
        const { body } = req
        const user = await UserService.editUser(id, body)

        if (!user)
            throw new UserNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                message: 'User updated successfully!',
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

        const user = await UserService.editUser(id, body)

        if (!user) {
            throw new UserNotFoundException()
        }
        res.status(200)
            .send({
                statusCode: 200,
                message: 'User updated successfully!',
                user
            })
    } catch (e) {
        next(e)
    }
}

const deleteMe = async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await UserService.deleteUser(id)

        if (!user)
            throw new UserNotFoundException()

        res.status(200)
            .send({
                statusCode: 200,
                message: 'User deleted successfully!'
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
                message: 'User deleted successfully!',
            })
    } catch (e) {
        next(e)
    }
}

const uploadAvatar = async (req, res, next) => {
    try {
        const { id } = req.user

        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded!' })
        }

        const user = await UserService.getUserById(id)
        if (!user) throw new UserNotFoundException()


        if (user.avatar && user.avatar.includes('cloudinary.com')) {
            try {

                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET
                });


                const urlParts = user.avatar.split('/');
                const uploadIndex = urlParts.indexOf('upload');

                if (uploadIndex !== -1) {
                    let publicIdParts = urlParts.slice(uploadIndex + 1);


                    if (publicIdParts[0].includes(',')) {
                        publicIdParts.shift();
                    }


                    if (publicIdParts[0].startsWith('v') && !isNaN(publicIdParts[0].substring(1))) {
                        publicIdParts.shift();
                    }


                    const publicId = publicIdParts.join('/').split('.')[0];

                    console.log(`[Cloudinary] Tentativo di distruggere: ${publicId}`);

                    const destroyResult = await cloudinary.uploader.destroy(publicId);
                    console.log(`[Cloudinary] Risultato:`, destroyResult);
                }
            } catch (cloudinaryError) {
                console.error("Non è stato possibile eliminare il vecchio file da Cloudinary:", cloudinaryError);
            }
        }

        const avatarUrl = req.file.path;
        const updatedUser = await UserService.editUser(id, { avatar: avatarUrl });

        res.status(200).send({
            message: "Avatar updated successfully!",
            avatar: updatedUser.avatar
        })
    } catch (e) {
        console.error(`${pc.red("🚨 CRITICAL ERROR IN AVATAR UPLOAD:")}, ${e}`);
        next(e)
    }
}

module.exports = {
    getMe,
    getUsers,
    getUserById,
    editMe,
    editUser,
    deleteMe,
    deleteUser,
    uploadAvatar
}