require('dotenv').config()
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
            text: 'SELECT ticket_id as "ticketId", ticket_subject as "ticketSubject", ticket_priority as "ticketPriority", ticket_status as "ticketStatus", ticket_create_at as "ticketCreateAt" FROM ticket WHERE ticket_status = $1',
            values: ['Open']
        }

        if (userRole === 'Karyawan') {
            query.text += ' AND ticket_create_by = $2'
            query.values.push(userId)
        }

        if(searchQuery) {
            const nextParam = query.values.length +1
            query.text += ` AND (ticket_id::text ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam})`
            query.values.push(`%${searchQuery.trim()}%`)
        }

        query.text += " ORDER BY ticket_create_at DESC"

        const result = await this._pool.query(query)
        return result.rows
    }

    async getProgressTickets(userRole, userId, searchQuery) {
        const query = {
            text: 'SELECT ticket_id as "ticketId", ticket_subject as "ticketSubject", ticket_priority as "ticketPriority", ticket_status as "ticketStatus", ticket_create_at as "ticketCreateAt" FROM ticket',
            values: ['On Progress']
        }

        if (userRole === 'Karyawan') {
            query.text += ' WHERE ticket.ticket_status = $1 AND ticket.ticket_create_by = $2';
            query.values.push(userId);
        } else if (userRole === 'Teknisi') {
            query.text += ' JOIN assignment ON ticket.ticket_id = assignment.assignment_ticket WHERE ticket.ticket_status = $1 AND assignment.assignment_assigned_to = $2';
            query.values.push(userId);
        } else {
            query.text += ' WHERE ticket.ticket_status = $1';
        }

        if(searchQuery) {
            const nextParam = query.values.length +1
            query.text += ` AND (ticket_id::text ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam})`
            query.values.push(`%${searchQuery.trim()}%`)
        }

        query.text += " ORDER BY ticket_create_at DESC"

        const result = await this._pool.query(query)
        return result.rows
    }

    async getClosedTickets(userRole, userId, searchQuery) {
        const query = {
            text: 'SELECT ticket_id as "ticketId", ticket_subject as "ticketSubject", ticket_priority as "ticketPriority", ticket_status as "ticketStatus", ticket_create_at as "ticketCreateAt" FROM ticket',
            values: ['Closed']
        }

        if (userRole === 'Karyawan') {
            query.text += ' WHERE ticket.ticket_status = $1 AND ticket.ticket_create_by = $2';
            query.values.push(userId);
        } else if (userRole === 'Teknisi') {
            query.text += ' JOIN assignment ON ticket.ticket_id = assignment.assignment_ticket WHERE ticket.ticket_status = $1 AND assignment.assignment_assigned_to = $2';
            query.values.push(userId);
        } else {
            query.text += ' WHERE ticket.ticket_status = $1';
        }

        if(searchQuery) {
            const nextParam = query.values.length +1
            query.text += ` AND (ticket_id::text ILIKE $${nextParam} OR ticket_subject ILIKE $${nextParam} OR ticket_description ILIKE $${nextParam})`
            query.values.push(`%${searchQuery.trim()}%`)
        }

        query.text += " ORDER BY ticket_create_at DESC"

        const result = await this._pool.query(query)
        return result.rows
    }

    async getTicketById(ticketId) {
        let query, result, data
        query = {
            text: 'SELECT ticket.ticket_id AS "ticketId", ticket.ticket_subject AS "ticketSubject", ticket.ticket_description AS "ticketDescription", ticket.ticket_status AS "ticketStatus", ticket.ticket_priority AS "ticketPriority", area.area_name AS "ticketArea", category.category_name AS "ticketCategory", users.user_name AS "ticketCreatedBy", department.department_name AS "ticketDepartmentBy", ticket.ticket_create_at AS "ticketCreatedAt", ticket.ticket_update_at AS "ticketUpdatedAt" FROM ticket JOIN users ON users.user_id = ticket.ticket_create_by JOIN department ON department.department_id = ticket.ticket_user_department JOIN area ON area.area_id = ticket.ticket_area JOIN category ON category.category_id = ticket.ticket_category WHERE ticket.ticket_id = $1;',
            values: [ticketId]
        }

        result = await this._pool.query(query)
        if(!result.rows.length) {
            throw new NotFoundError("Ticket tidak ditemukan")
        }
        data = result.rows[0]
        query = {
            text: 'SELECT users.user_name FROM users JOIN assignment on assignment.assignment_assigned_to = users.user_id WHERE assignment.assignment_ticket = $1',
            values: [ticketId]
        }
        result = await this._pool.query(query)
        data.ticketAssignedTo = (result.rows[0] === undefined) ? null : result.rows[0].user_name
        query = {
            text: 'SELECT users.user_name as "commentName", comment.comment_content as "commentContent", comment.comment_image as "commentImage", comment.comment_create_at as "commentTime", users.user_role as "commentUserRole" FROM comment JOIN users ON users.user_id = comment.comment_create_by WHERE comment.comment_ticket = $1',
            values: [ticketId]
        }
        result = await this._pool.query(query)
        data.comments = result.rows
        query = {
            text: 'SELECT users.user_name as "resolutionName", resolution.resolution_content as "resolutionContent", resolution.resolution_resolve_at as "resolutionTime" FROM resolution JOIN users ON users.user_id = resolution.resolution_resolve_by WHERE resolution.resolution_ticket = $1',
            values: [ticketId]
        }
        result = await this._pool.query(query)
        data.resolution = result.rows
        return data
    }

    async addTicket(userId, { ticketSubject, ticketDescription, ticketPriority, ticketArea, ticketCategory }) {
        let query = {
            text: 'SELECT user_department FROM users WHERE user_id = $1',
            values: [userId]
        }
        let result = await this._pool.query(query)
        query = {
            text: 'INSERT INTO ticket (ticket_subject, ticket_description, ticket_status, ticket_priority, ticket_area, ticket_category, ticket_create_by, ticket_user_department) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ticket_id',
            values: [ticketSubject, ticketDescription, 'Open', ticketPriority, ticketArea, ticketCategory, userId, result.rows[0].user_department]
        }

        result = await this._pool.query(query)
        if(!result.rows[0].ticket_id) {
            throw new InvariantError('Ticket gagal ditambahkan')
        }

        return result.rows[0].ticket_id
    }

    async verifyTechAccess(ticketId, userId) {
        const query = {
            text: 'SELECT ticket_id FROM ticket JOIN assignment ON ticket.ticket_id = assignment.assignment_ticket WHERE ticket.ticket_id = $1 AND assignment.assignment_assigned_to = $2',
            values: [ticketId, userId]
        }

        const result = await this._pool.query(query)
        if(!result.rowCount) {
            throw new AuthorizationError("anda tidak berhak mengakses resource ini")
        }
    }

    async updateTicket(ticketId) {
        const query = {
            text: 'UPDATE ticket SET ticket_update_at = NOW() WHERE ticket_id = $1 RETURNING ticket_id',
            values: [ticketId]
        }

        const result = await this._pool.query(query)
        
        if(!result.rowCount) {
            throw new NotFoundError("Ticket tidak ditemukan")
        }
    }

    async updateTicketToOnProgress(ticketId) {
        const query = {
            text: "UPDATE ticket SET ticket_status = 'On Progress',ticket_update_at = NOW() WHERE ticket_id = $1 RETURNING ticket_id",
            values: [ticketId]
        }

        const result = await this._pool.query(query)
        
        if(!result.rowCount) {
            throw new NotFoundError("Ticket tidak ditemukan")
        }
    }

    async closeTicket(ticketId) {
        const query = {
            text: "UPDATE ticket SET ticket_status = 'Closed', ticket_update_at = NOW() WHERE ticket_id = $1 RETURNING ticket_id",
            values: [ticketId]
        }

        const result = await this._pool.query(query)
        
        if(!result.rowCount) {
            throw new NotFoundError("Ticket tidak ditemukan")
        }
    }

    async exportReport(startDate, endDate) {
        const query = {
            text : "SELECT ticket.ticket_id, ticket.ticket_subject, ticket.ticket_description, ticket.ticket_status, ticket.ticket_priority, area.area_name as ticket_area, category.category_name as ticket_category, users.user_name as ticket_created_by, department.department_name as ticket_department_by, ticket.ticket_create_at, ticket.ticket_update_at FROM ticket JOIN area ON ticket.ticket_area = area.area_id JOIN category ON ticket.ticket_category = category.category_id JOIN users ON ticket.ticket_create_by = users.user_id JOIN department ON ticket.ticket_user_department = department.department_id WHERE ticket_create_at::date BETWEEN $1 AND $2",
            values: [startDate, endDate]
        }
        const result = await this._pool.query(query)        
        return result.rows
    }

    async verifyUserAccess(ticketId, userId) {
        const query = {
            text: 'SELECT ticket_id FROM ticket WHERE ticket_id = $1 AND ticket_create_by = $2',
            values: [ticketId, userId]
        }

        const result = await this._pool.query(query)
        if(!result.rowCount) {
            throw new AuthorizationError("anda tidak berhak mengakses resource ini")
        }
    }
}

module.exports = TicketService