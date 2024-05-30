const jwt = require('jsonwebtoken')
const AuthenticationError =require('../exceptions/AuthenticationError')

const verifyToken = (req, _, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        req.userId = decode.userId
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = verifyToken