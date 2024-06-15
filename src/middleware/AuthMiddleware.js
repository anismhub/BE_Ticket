const jwt = require('jsonwebtoken')
const AuthenticationError =require('../exceptions/AuthenticationError')
const AuthorizationError =require('../exceptions/AuthorizationError')
const ClientError =require('../exceptions/ClientError')
const UsersService = require('../services/UsersService')
const usersService = new UsersService()

const verifyToken = async (req, _, next) => {
    try {
        const authHeader = req.header('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Unauthenticated")
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        await usersService.verifyActiveUser(decode.userId)
        req.userId = decode.userId
        req.userName = decode.userName
        req.userFullName = decode.userFullName
        req.userRole = decode.userRole
        next()
    } catch (error) {
        next(error)
    }
}

const verifyClientToken = async (req, _, next) => {
    try {
        const authHeader = req.header('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Unauthenticated")
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        if (decode.userRole != 'Karyawan') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        await usersService.verifyActiveUser(decode.userId)
        req.userId = decode.userId
        req.userName = decode.userName
        req.userFullName = decode.userFullName
        req.userRole = decode.userRole
        next()
    } catch (error) {
        next(error)
    }
}

const verifyTechToken = async (req, _, next) => {
    try {
        const authHeader = req.header('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Unauthenticated")
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        if (decode.userRole != 'Teknisi') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        await usersService.verifyActiveUser(decode.userId)
        req.userId = decode.userId
        req.userName = decode.userName
        req.userFullName = decode.userFullName
        req.userRole = decode.userRole
        next()
    } catch (error) {
        next(error)
    }
}

const verifyAdminToken = async (req, _, next) => {
    try {
        const authHeader = req.header('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Unauthenticated")
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        if (decode.userRole != 'Administrator') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        await usersService.verifyActiveUser(decode.userId)
        req.userId = decode.userId
        req.userName = decode.userName
        req.userFullName = decode.userFullName
        req.userRole = decode.userRole
        next()
    } catch (error) {
        next(error)
    }
}

const verifyAdminOrTechToken = async (req, _, next) => {
    try {
        const authHeader = req.header('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Unauthenticated")
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new AuthenticationError("Unauthenticated")
        }
        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode.userId) {
            throw new ClientError("Invalid Token")
        }
        if (decode.role == 'Karyawan') {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
        }
        await usersService.verifyActiveUser(decode.userId)
        req.userId = decode.userId
        req.userName = decode.userName
        req.userFullName = decode.userFullName
        req.userRole = decode.userRole
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { verifyToken, verifyClientToken, verifyTechToken, verifyAdminToken, verifyAdminOrTechToken}