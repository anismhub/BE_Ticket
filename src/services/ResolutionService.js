const { Pool } = require('pg')
const InvariantError = require('../exceptions/InvariantError')

class ResolutionService {
    constructor() {
        this._pool = new Pool()
    }

    async addResolution(ticketId, userId, content) {
        const query = {
            text: 'INSERT INTO resolution (resolution_ticket, resolution_resolve_by, resolution_content) VALUES($1, $2, $3) RETURNING resolution_id',
            values: [ticketId, userId, content]
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].resolution_id) {
            throw new InvariantError('Gagal close ticket')
        }

        return result.rows[0].resolution_id
    }
}

module.exports = ResolutionService