const router = require('express').Router()
const { verifyAdminToken, verifyToken } = require('../../middleware/AuthMiddleware')
const UsersService = require('../../services/UsersService')
const UsersHandler = require('./controller')
const UsersValidator = require('../../validator/UsersValidator')
const TokenManager = require('../../tokenize/TokenManager')
const usersService = new UsersService()
const usersHandler = new UsersHandler(usersService, UsersValidator, TokenManager)


router.get('/Users', verifyAdminToken, usersHandler.getUsers)
router.post('/Users/Auth', usersHandler.postLogin)
router.get('/Users/Profile', verifyToken, usersHandler.getProfile)

module.exports = router