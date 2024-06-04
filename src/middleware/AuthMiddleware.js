const jwt = require('jsonwebtoken')
const AuthenticationError =require('../exceptions/AuthenticationError')
const AuthorizationError =require('../exceptions/AuthorizationError')
const ClientError =require('../exceptions/ClientError')

const verifyToken = (req, _, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        req.userId = decode.userId
        req.userName = decode.userName
        req.userRole = decode.userRole
        next()
    } catch (error) {
        next(error)
    }
}

const verifyTechToken = (req, _, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        if (decode.role != 'Teknisi') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        next()
    } catch (error) {
        next(error)
    }
}

const verifyAdminToken = (req, _, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        if (decode.role != 'Administrator') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { verifyToken, verifyTechToken, verifyAdminToken}