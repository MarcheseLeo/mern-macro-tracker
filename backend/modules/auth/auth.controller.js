const AuthService = require('./auth.service')

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const {token} = await AuthService.login(email, password)

        res.header('authorization', token)
            .status(200)
            .send({
                statusCode:200,
                message: "Login successfully",
                token
            })
    } catch (e) {
        next(e)
    }
}

const register = async(req, res, next) =>{
    try{
        const {body} = req
        const user = await AuthService.register(body)

        res.status(201)
            .send({
                statusCode: 201,
                message: 'User registered successfully',
                user
            })
    }catch(e){
        next(e)
    }
}

module.exports = {
    login,
    register
}