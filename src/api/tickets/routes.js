const { verifyToken, verifyClientToken, verifyAdminToken, verifyAdminOrTechToken } = require('../../middleware/AuthMiddleware')
const TicketService = require('../../services/TicketService')
const AssignService = require('../../services/AssignService')
const CommentService = require('../../services/CommentService')
const ResolutionService = require('../../services/ResolutionService')
const TokenService = require('../../services/TokenService')
const NotificationService = require('../../services/NotificationService')
const TicketHandler = require('./controller')
const TicketValidator = require('../../validator/TicketValidator')
const ticketService = new TicketService()
const assignService = new AssignService()
const commentService = new CommentService()
const resolutionService = new ResolutionService()
const tokenService = new TokenService()
const notificationService = new NotificationService()
const ticketHandler = new TicketHandler(ticketService, assignService, commentService, resolutionService, tokenService, notificationService, TicketValidator)

const router = require('express').Router()

router.get('/Tickets', verifyToken, ticketHandler.getTickets)

router.post('/Tickets/Export', verifyAdminOrTechToken, ticketHandler.exportReport)

router.get('/Tickets/Export/:data', verifyAdminOrTechToken, ticketHandler.downloadReport)

router.get('/Tickets/:id', verifyToken, ticketHandler.getTicketById)

router.post('/Tickets', verifyToken, ticketHandler.postAddTicket)

router.post('/Tickets/:id/Assign', verifyAdminToken, ticketHandler.postAssignTicket)

router.post('/Tickets/:id/Comments', verifyAdminOrTechToken, ticketHandler.upload, ticketHandler.postAddCommentTicket)

router.post('/Tickets/:id/Close', verifyAdminOrTechToken,ticketHandler.postCloseTicket)

module.exports = router