const router = require('express').Router()
const verifyToken = require('../../middleware/AuthMiddleware')
const UsersService = require('../../services/UsersService')
const UsersHandler = require('./controller')
const usersService = new UsersService()
const usersHandler = new UsersHandler(usersService)

router.get('/users', verifyToken, usersHandler.getUsers)

module.exports = router