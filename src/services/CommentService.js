const { Pool } = require('pg')

class CommentService {
    constructor() {
        this._pool = new Pool()
    }

    async postComment(ticketId, userId, content) {
        const query = {
            text: 'INSERT INTO comment (comment_ticket, comment_create_by, comment_content) VALUES ($1, $2, $3) RETURNING comment_id',
            values: [ticketId, userId, content]
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].comment_id) {
            throw new InvariantError('Gagal tambah komen')
        }

        return result.rows[0].comment_id
    }
}

module.exports = CommentService