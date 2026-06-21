const jwt = require('jsonwebtoken')
const InvalidOrMissingTokenException = require('../../exceptions/auth/InvalidOrMissingTokenException')
const pc = require('picocolors')

const EXCLUDED_ROUTES = [
    '/auth/login',
    '/auth/google',
    '/auth/google/callback'
]

const verifyToken = async (req, res, next) => {
    if (EXCLUDED_ROUTES.includes(req.path) || (req.path === '/users' && req.method === 'POST')) return next()

    const token = req.header('authorization')

    if (!token) {
        throw new InvalidOrMissingTokenException()
    }

    try {
        req.user = await jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET)
        console.log(
            pc.green('▶ Auth OK ') +
            pc.cyan(`${req.user.firstName} ${req.user.lastName} `) +
            pc.dim(`[${req.user.email}]`)
        )
        next()
    } catch (e) {
        console.log(pc.red('✖ Errore Auth: Token non valido o scaduto'))
        return next(new InvalidOrMissingTokenException())
    }
}

module.exports = verifyToken