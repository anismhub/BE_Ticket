const { Pool } = require('pg')

class DepartmentService {
    constructor() {
        this._pool = new Pool()
    }

    async getDepartments() {
        const result = await this._pool.query("SElECT * FROM department")
        return result.rows
    }
}

module.exports = DepartmentService