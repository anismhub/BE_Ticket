const { Pool } = require('pg')

class TokenService {
    constructor() {
        this._pool = new Pool()
    }

    async saveToken(userId, deviceId, token) {
        let query
        query = {
            text: 'UPDATE INTO token set token_value = $1 WHERE token_user = $2 AND token_device = $3 RETURNING token_user',
            values: [token, userId, deviceId]
        }
        result = await this._pool.query(query)
        if(!result.rows[0].token_user) {
            query = {
                text: 'INSERT INTO token VALUES ($1, $2, $3) RETURNING token_user',
                values: [userId, deviceId, token]
            }
            result = await this._pool.query(query)
        }

        return result.rows[0].token_user
    }

    async removeToken(user_id, deviceId) {
        const query = {
            text: 'DELETE FROM token WHERE token_user = $1 AND token_device = $2 RETURNING token_user',
            values: [user_id, deviceId]
        }
        
        await this._pool.query(query)
    }

    async getAdminsToken() {
        const query = `SELECT users.user_id as "userId", token.token_value as token FROM users LEFT JOIN token ON users.user_id = token.token_user WHERE users.user_role = 'Administrator' and users.user_status = TRUE`
        const result = await this._pool.query(query)

        return result.rows
    }

    async getAssignedToken(ticketId) {
        const query = {
            text: `SELECT u.user_id as "userId", t.token_value as token, users.user_role as "userRole" FROM (SELECT ticket_create_by AS user_id FROM ticket WHERE ticket_id = $1 UNION SELECT assignment_assigned_to AS user_id FROM assignment WHERE assignment_ticket = $1) u LEFT JOIN token t ON u.user_id = t.token_user JOIN users ON u.user_id = users.user_id`,
            values: [ticketId]
        }

        const result = await this._pool.query(query)

        return result.rows
    }

    async getTicketUserToken(ticketId) {
        const query = {
            text: `SELECT ticket.ticket_create_by as "userId", token.token_value as token FROM ticket LEFT JOIN token ON token.token_user = ticket.ticket_create_by WHERE ticket.ticket_id = $1`,
            values: [ticketId]
        }

        const result = await this._pool.query(query)

        return result.rows
    }

    async getCommentUserToken(ticketId, userId) {
        const query = {
            text: `SELECT u.user_id as "userId", t.token_value as token, users.user_role as "userRole" FROM (SELECT ticket_create_by AS user_id FROM ticket WHERE ticket_id = $1 UNION SELECT assignment_assigned_to AS user_id FROM assignment WHERE assignment_ticket = $1) u LEFT JOIN token t ON u.user_id = t.token_user JOIN users ON u.user_id = users.user_id WHERE u.user_id != $2`,
            values: [ticketId, userId]
        }

        const result = await this._pool.query(query)

        return result.rows
    }

}

module.exports = TokenService