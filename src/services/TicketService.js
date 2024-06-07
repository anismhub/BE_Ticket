const { Pool } = require('pg')
const AuthorizationError = require('../exceptions/AuthorizationError')
const InvariantError = require('../exceptions/InvariantError')
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
            query.text += ` AND ticket_id::text ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam}`
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
            query.text += ` AND ticket_id::text ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam}`
            query.values.push(`%${searchQuery.trim()}%`)
        }

        const result = await this._pool.query(query)
        return result.rows
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
            query.text += ` AND ticket_id::text ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam}`
            query.values.push(`%${searchQuery.trim()}%`)
        }

        const result = await this._pool.query(query)
        return result.rows
    }

    async addTicket(userId, { ticketSubject, ticketDescription, ticketPriority, ticketArea, ticketCategory }) {
        const query = {
            text: 'INSERT INTO ticket (ticket_subject, ticket_description, ticket_status, ticket_priority, ticket_area, ticket_category, ticket_create_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ticket_id',
            values: [ticketSubject, ticketDescription, 'Open', ticketPriority, ticketArea, ticketCategory, userId]
        }

        const result = await this._pool.query(query)
        if(!result.rows[0].ticket_id) {
            throw new InvariantError('Ticket gagal ditambahkan')
        }

        return result.rows[0].ticket_id
    }

    async verifyTechAccess(ticketId, userId) {
        let query
        let result
        query = {
            text: 'SELECT ticket_id FROM ticket WHERE ticket_id = $1',
            values: [ticketId]
        }

        result = await this._pool.query(query)
        if(!result.rows.length) {
            throw new NotFoundError("Ticket tidak ditemukan")
        }

        query = {
            text: 'SELECT ticket_id FROM ticket JOIN assignment ON ticket.ticket_id = assignment.assignment_ticket WHERE ticket.ticket_id = $1 AND assignment.assignment_assigned_to = $2',
            values: [ticketId, userId]
        }

        result = await this._pool.query(query)
        if(!result.rows.length) {
            throw new AuthorizationError("anda tidak berhak mengakses resource ini")
        }
    }
    async updateTicket(ticketId) {
        const query = {
            text: 'UPDATE ticket SET ticket_update_at = NOW() WHERE ticket_id = $1 RETURNING ticket_id',
            values: [ticketId]
        }

        const result = await this._pool.query(query)
        
        if(!result.rows.length) {
            throw new NotFoundError("Ticket tidak ditemukan")
        }
    }

    async closeTicket(ticketId) {
        const query = {
            text: "UPDATE ticket SET ticket_status = 'Closed', ticket_update_at = NOW() WHERE ticket_id = $1 RETURNING ticket_id",
            values: [ticketId]
        }

        const result = await this._pool.query(query)
        
        if(!result.rows.length) {
            throw new NotFoundError("Ticket tidak ditemukan")
        }
    }
}

module.exports = TicketService