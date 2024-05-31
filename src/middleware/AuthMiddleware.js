const jwt = require('jsonwebtoken')
const AuthenticationError =require('../exceptions/AuthenticationError')
const AuthorizationError =require('../exceptions/AuthorizationError')
const InvariantError =require('../exceptions/InvariantError')

const verifyToken = (req, _, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new InvariantError("Invalid Token")
        }
        req.userId = decode.userId
        req.userName = decode.userName
        req.role = decode.role
        next()
    } catch (error) {
        next(error)
    }
}

const verifyTechToken = (req, _, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new InvariantError("Invalid Token")
        }
        if (decode.role != 'Teknisi') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        req.userId = decode.userId
        req.userName = decode.userName
        req.role = decode.role
        next()
    } catch (error) {
        next(error)
    }
}

const verifyAdminToken = (req, _, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new InvariantError("Invalid Token")
        }
        if (decode.role != 'Administrator') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        req.userId = decode.userId
        req.userName = decode.userName
        req.role = decode.role
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { verifyToken, verifyTechToken, verifyAdminToken}