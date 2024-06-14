const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const AuthorizationError = require('../exceptions/AuthorizationError')
const InvariantError = require('../exceptions/InvariantError')
const AuthenticationError = require('../exceptions/AuthenticationError')
const NotFoundError = require('../exceptions/NotFoundError')

class UsersService {
    constructor() {
        this._pool = new Pool()
    }

    async getUsers(userId, searchQuery) {
        const query = {
            text: 'SELECT user_id as "userId", user_name as "userFullName", user_login as "userName", user_role as "userRole", department_id as "departmentId", department_name as "departmentName", user_phone as "userPhone" FROM users JOIN department ON users.user_department = department.department_id WHERE users.user_status = TRUE AND users.user_id != $1',
            values: [userId]
        }
        if (searchQuery) {
            const nextParam = query.values.length +1
            query.text += ` AND (user_id::text ILIKE $${nextParam} OR user_name ILIKE $${nextParam} OR user_login ILIKE $${nextParam} OR user_role::text ILIKE $${nextParam} OR department_name ILIKE $${nextParam})`
            query.values.push(`%${searchQuery.trim()}%`)            
        }
        const result = await this._pool.query(query)
        return result.rows
    }

    async getTechUsers() {
        const query = {
            text: 'SELECT user_id as "userId", user_name as "userFullName" FROM users WHERE user_role = $1 AND user_status = TRUE',
            values: ['Teknisi']
        }
        const result = await this._pool.query(query)
        return result.rows
    }

    async getUserById(userId) {
        const query = {
            text: 'SELECT user_id as "userId", user_name as "userFullName", user_login as "userName", user_role as "userRole",department_id as "departmentId", department_name as "departmentName", user_phone as "userPhone" FROM users JOIN department ON users.user_department = department.department_id WHERE user_id = $1 AND user_status = TRUE',
            values: [userId]
        }
        const result = await this._pool.query(query)
        
        if (!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan')
        }

        return result.rows[0]
    }

    async changeUserPassword(userId, password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const query = {
            text: 'UPDATE users SET user_password = $1 WHERE user_id = $2 RETURNING user_id',
            values: [hashedPassword, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui Password. Id tidak ditemukan')
        }

        return result.rows[0].user_id
    }

    async addUser({ username, fullname, password, role, department, phoneNumber}) {
        await this.verifyNewUsername(username)
        const hashedPassword = await bcrypt.hash(password, 10)
        const query = {
            text: 'INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone) VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id',
            values: [fullname, username, hashedPassword, role, department, phoneNumber]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('User Gagal ditambah')
        }

        return result.rows[0].user_id
    }

    async editUser(userId, { username, fullname, role, department, phoneNumber }) {
        await this.verifyNewUsername(username)
        const query = {
            text: 'UPDATE users SET user_name = $1, user_login = $2, user_role = $3, user_department = $4, user_phone = $5 WHERE user_id = $6 RETURNING user_id',
            values: [fullname,  username, role, department, phoneNumber, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui User. Id tidak ditemukan')
        }

        return result.rows[0].user_id
    }

    async deleteUser(userId) {
        const query = {
            text: 'UPDATE users SET user_status = FALSE where user_id = $1 RETURNING user_id',
            values: [userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Gagal menghapus User Id tidak ditemukan')
        }

        return result.rows[0].user_id
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT user_name FROM users WHERE user_name = $1',
            values: [username]
        }

        const result = await this._pool.query(query)

        if(result.rowCount > 0) {
            throw new InvariantError("Username sudah dipakai")
        }
    }

    async verifyAdminCredential(credentialType) {
        if(credentialType != 'Administrator') {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
        }
    }

    async verifyTechOrAdminCredential(credentialType) {
        if(credentialType != 'Administrator' || credentialType != 'Teknisi') {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
        }
    }

    async verifyCredential(username, password) {
        const query = {
            text: 'SELECT user_id, user_name, user_login, user_password, user_role FROM users WHERE user_login = $1 AND user_status = TRUE',
            values: [username]
        }

        const result = await this._pool.query(query)
        if(!result.rowCount) {
            throw new AuthenticationError("Kredensial yang Anda berikan salah")
        }

        const { user_id: userId, user_name: userFullName, user_login: userName, user_password: hashedPassword, user_role: userRole } = result.rows[0]

        const match = await bcrypt.compare(password, hashedPassword)

        if (!match) {
            throw new AuthenticationError("Kredensial yang Anda berikan salah")
        }

        return { userId, userName, userFullName, userRole }
    }
}

module.exports = UsersService