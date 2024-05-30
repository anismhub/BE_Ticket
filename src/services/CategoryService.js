const { Pool } = require('pg')

class CategoryService {
    constructor() {
        this._pool = new Pool()
    }

    async getCategories() {
        const result = await this._pool.query("SElECT * FROM category")
        return result.rows
    }
}