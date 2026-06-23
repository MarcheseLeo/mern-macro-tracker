const jwt = require('jsonwebtoken')

const manageOauthCallback = async(req, res, next) =>{
    try{
        const payload = {
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:  process.env.JWT_EXPIRES_IN || '1d'})

        const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?token=${token}`
        res.redirect(redirectUrl)
    }catch(e){
        next(e)
    }
}

module.exports = {
    manageOauthCallback
}