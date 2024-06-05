const { verifyToken, verifyClientToken, verifyAdminToken, verifyAdminOrTechToken } = require('../../middleware/AuthMiddleware')
const TicketService = require('../../services/TicketService')
const AssignService = require('../../services/AssignService')
const CommentService = require('../../services/CommentService')
const TicketHandler = require('./controller')
const TicketValidator = require('../../validator/TicketValidator')
const ticketService = new TicketService()
const assignService = new AssignService()
const commentService = new CommentService()
const ticketHandler = new TicketHandler(ticketService, assignService, commentService, TicketValidator)

const router = require('express').Router()

router.get('/Tickets', verifyToken, ticketHandler.getTickets)

router.post('/Tickets', verifyClientToken, ticketHandler.postAddTicket)

router.put('/Tickets/:id/Assign', verifyAdminToken, ticketHandler.putAssignTicket)

router.post('/Tickets/:id/Comments', verifyAdminOrTechToken, ticketHandler.postAddCommentTicket)

module.exports = router