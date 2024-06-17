const router = require('express').Router()
const { verifyAdminToken, verifyToken } = require('../../middleware/AuthMiddleware')
const UsersService = require('../../services/UsersService')
const TokenService = require('../../services/TokenService')
const NotificationService = require('../../services/NotificationService')
const UsersHandler = require('./controller')
const UsersValidator = require('../../validator/UsersValidator')
const TokenManager = require('../../tokenize/TokenManager')
const usersService = new UsersService()
const tokenService = new TokenService()
const notificationService = new NotificationService()
const usersHandler = new UsersHandler(usersService, tokenService, notificationService, UsersValidator, TokenManager)

router.get('/Users', verifyAdminToken, usersHandler.getUsers)
router.post('/Users', verifyAdminToken, usersHandler.postAddUser)
router.post('/Users/Auth', usersHandler.postLogin)
router.get('/Users/Profile', verifyToken, usersHandler.getProfile)
router.get('/Users/Notification', verifyToken, usersHandler.getNotification)
router.get('/Users/Tech', verifyAdminToken, usersHandler.getTech)
router.post('/Users/Token', verifyToken, usersHandler.postToken)
router.put('/Users/Token', verifyToken, usersHandler.deleteToken)
router.post('/Users/Password', verifyToken, usersHandler.postChangePassword)
router.get('/Users/:id', verifyToken, usersHandler.getUserById)
router.post('/Users/:id', verifyAdminToken, usersHandler.postEditUser)
router.delete('/Users/:id', verifyAdminToken, usersHandler.deleteUser)



module.exports = router