const { Pool } = require('pg')

class AssignService {
    constructor() {
        this._pool = new Pool()
    }

    async addAssignment(ticketId, userId) {
        const query = {
            text: 'INSERT INTO assignment (assignment_ticket, assignment_assigned_to) VALUES ($1, $2) RETURNING assignment_id',
            values: [ticketId, userId]
        }

        const result = await this._pool.query(query)
        if(!result.rows[0].assignment_id) {
            throw new InvariantError('Assignment Ticket Gagal')
        }

        return result.rows[0].assignment_id
    }
}

module.exports = AssignService