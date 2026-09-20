const User = require('../../modules/users/user.schema')
const HttpException = require('../../exceptions')

const requireAdmin = async (req, res, next) => {
    const user = await User.findById(req.user?.id).select('role')

    if (!user || user.role !== 'admin') {
        return next(new HttpException('Administrator access is required.', 403, 'Forbidden'))
    }

    next()
}

module.exports = requireAdmin
