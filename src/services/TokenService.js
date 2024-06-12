const { Pool } = require('pg')

class TokenService {
    constructor() {
        this._pool = new Pool()
    }

    async saveToken(userId, token) {
        const query = {
            text: 'INSERT INTO token VALUES ($1, $2)',
            values: [userId, token]
        }

        await this._pool.query(query)
    }

    async getAdminsToken() {
        const query = `SELECT token.token_user as "userId", token.token_value as token FROM token JOIN users ON users.user_id = token.token_user WHERE users.user_role = 'Administrator'`
        const result = await this._pool.query(query)

        return result.rows
    }

}

module.exports = TokenService