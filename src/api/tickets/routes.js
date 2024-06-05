const { verifyToken } = require('../../middleware/AuthMiddleware')
const TicketService = require('../../services/TicketService')
const TicketHandler = require('./controller')
const TicketValidator = require('../../validator/TicketValidator')
const ticketService = new TicketService()
const ticketHandler = new TicketHandler(ticketService, TicketValidator)

const router = require('express').Router()

router.get('/Tickets', verifyToken, ticketHandler.getTickets)

module.exports = router