//const InvariantError = require('../../exceptions/InvariantError')


class UsersHandler {
    constructor(service, validator, tokenManager) {
        this._service = service
        this._validator = validator
        this._tokenManager = tokenManager

        this.getUsers = this.getUsers.bind(this)
        this.getUserById = this.getUserById.bind(this)
        this.postLogin = this.postLogin.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.getTech = this.getTech.bind(this)
        this.postAddUser = this.postAddUser.bind(this)
        this.postEditUser = this.postEditUser.bind(this)
        this.postChangePassword = this.postChangePassword.bind(this)
    }

    async getUsers(_req, res, next) {
        try {
            const result = await this._service.getUsers()
            const response = {
                error: false,
                status: 200,
                message: 'Success',
                data: result
            }
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getUserById(req, res, next) {
        try {
            const result = await this._service.getUserById(req.params.id)
                const response = {
                    error: false,
                    status: 200,
                    message: 'Success',
                    data: result
                }
                res.status(200).send(response)
        } catch (error) {
            next(error)
        }
    }

    async postLogin(req, res, next) {
        try {
            this._validator.validateLoginPayload(req.body)

            const { username: userLogin, password } = req.body

            const userCred = await this._service.verifyCredential(userLogin, password)

            const accessToken = this._tokenManager.generateToken({
                userId: userCred.userId,
                userName: userCred.userName,
                userRole: userCred.userRole,
                userFullName: userCred.userFullName
            })

            const response = {
                error: false,
                status: 200,
                message: 'Success',
                data: {
                    ...userCred,
                    accessToken
                }
            }
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getProfile(req, res, next) {
        try {
            const result = await this._service.getUserById(req.userId)
            const response = {
                error: false,
                status: 200,
                message: 'Success',
                data: result
            }
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getTech(_req, res, next) {
        try {
            const result = await this._service.getTechUsers()
            const response = {
                error: false,
                status: 200,
                message: 'Success',
                data: result
            }
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async postAddUser(req, res, next) {
        try {
            this._validator.validateAddUserPayload(req.body)
            
            const result = await this._service.addUser(req.body)

            const response = {
                error: false,
                status: 201,
                message: `Pengguna telah dibuat dengan id #${result}`
            }
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }

    async postEditUser(req, res, next) {
        try {
            this._validator.validateEditUserPayload(req.body)
    
            const result = await this._service.editUser(req.params.id, req.body)
    
            const response = {
                error: false,
                status: 201,
                message: `Pengguna dengan id #${result} telah diubah `
            }
            res.status(201).send(response)
        } catch (error) {
            next(error)
        }
    }

    async postChangePassword(req, res, next) {
        try {
            this._validator.validateChangePasswordPayload(req.body)

            const result = await this._service.changeUserPassword(req.userId, req.body.password)

            const response = {
                error: false,
                status: 201,
                message: `User #${result} Berhasil ganti password`
            }
            res.status(201).send(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UsersHandler