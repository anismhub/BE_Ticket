const { Pool } = require('pg')

class AreaService {
    constructor() {
        this._pool = new Pool()
    }

    async getAreas() {
        const result = await this._pool.query("SElECT * FROM area")
        return result.rows
    }
}