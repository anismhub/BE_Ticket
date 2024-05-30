const InvariantError = require('../../exceptions/InvariantError')

class UsersHandler {
    constructor(service) {
        this._service = service

        this.getUsers = this.getUsers.bind(this)
    }

    

    async getUsers(req, res, next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UsersHandler