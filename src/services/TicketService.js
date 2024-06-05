const { Pool } = require('pg')
const AuthorizationError = require('../exceptions/AuthorizationError')
const InvariantError = require('../exceptions/InvariantError')
const AuthenticationError = require('../exceptions/AuthenticationError')
const NotFoundError = require('../exceptions/NotFoundError')

class TicketService {
    constructor() {
        this._pool = new Pool()
    }

    async getOpenTickets(userRole, userId, searchQuery) {
        const query = {
            text: 'SELECT ticket_id as ticketId, ticket_subject as ticketSubject, ticket_priority as ticketPriority, ticket_status as ticketStatus, ticket_create_at as ticketCreateAt FROM ticket WHERE ticket_status = $1',
            values: ['Open']
        }

        if (userRole === 'Karyawan') {
            query.text += ' AND ticket_create_by = $2'
            query.values.push(userId)
        }

        if(searchQuery) {
            const nextParam = query.values.length +1
            query.text += ` AND ticket_id ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam}`
            query.values.push(`%${searchQuery.trim()}%`)
        }

        const result = await this._pool.query(query)
        return result.rows
    }

    async getProgressTickets(userRole, userId, searchQuery) {
        const query = {
            text: 'SELECT ticket_id as ticketId, ticket_subject as ticketSubject, ticket_priority as ticketPriority, ticket_status as ticketStatus, ticket_create_at as ticketCreateAt FROM ticket WHERE ticket_status = $1',
            values: ['On Progress']
        }

        if (userRole !== 'Administrator') {
            query.text += ' AND ticket_create_by = $2'
            query.values.push(userId)
        }

        if(searchQuery) {
            const nextParam = query.values.length +1
            query.text += ` AND ticket_id ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam}`
            query.values.push(`%${searchQuery.trim()}%`)
        }
    }

    async getClosedTickets(userRole, userId, searchQuery) {
        const query = {
            text: 'SELECT ticket_id as ticketId, ticket_subject as ticketSubject, ticket_priority as ticketPriority, ticket_status as ticketStatus, ticket_create_at as ticketCreateAt FROM ticket WHERE ticket_status = $1',
            values: ['Closed']
        }

        if (userRole !== 'Administrator') {
            query.text += ' AND ticket_create_by = $2'
            query.values.push(userId)
        }

        if(searchQuery) {
            const nextParam = query.values.length +1
            query.text += ` AND ticket_id ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam}`
            query.values.push(`%${searchQuery.trim()}%`)
        }
    }
}

module.exports = TicketService