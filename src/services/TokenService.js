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

    async getAdminsToken() {
        const query = `SELECT token.token_user as "userId", token.token_value as token FROM token JOIN users ON users.user_id = token.token_user WHERE users.user_role = 'Administrator'`
        const result = await this._pool.query(query)

        return result.rows
    }

}

module.exports = TokenService