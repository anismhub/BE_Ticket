//const InvariantError = require('../../exceptions/InvariantError')


class UsersHandler {
    constructor(service, tokenService, notificationService, validator, tokenManager) {
        this._service = service
        this._tokenService = tokenService
        this._notificationService = notificationService
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
        this.deleteUser = this.deleteUser.bind(this)
        this.postToken = this.postToken.bind(this)
        this.deleteToken = this.deleteToken.bind(this)
        this.getNotification = this.getNotification.bind(this)
    }

    async getUsers(req, res, next) {
        try {
            const result = await this._service.getUsers(req.userId, req.query.search)
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
            res.status(201).json(response)
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
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }

    async deleteUser(req, res, next) {
        try {
            const result = await this._service.deleteUser(req.params.id)

            const response = {
                error: false,
                status: 200,
                message: `User #${result} Berhasil dihapus`
            }
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async postToken(req, res, next) {
        try {
            await this._validator.validatePostTokenPayload(req.body)

            const { deviceId, token } = req.body

            await this._tokenService.saveToken(req.userId, deviceId, token)

            const response = {
                error: false,
                status: 201,
                message: "Success"
            }
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }

    async deleteToken(req, res, next) {
        try {
            await this._validator.validateDeleteTokenPayload(req.body)

            const { deviceId } = req.body

            await this._tokenService.removeToken(req.userId, deviceId)
            const response = {
                error: false,
                status: 200,
                message: "Success"
            }
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getNotification(req, res, next) {
        try {
            const result = await this._notificationService.getNotification(req.userId)
            const response = {
                error: false,
                status: 200,
                message: "Success",
                data: result
            }
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UsersHandler