//const InvariantError = require('../../exceptions/InvariantError')


class UsersHandler {
    constructor(service, validator, tokenManager) {
        this._service = service
        this._validator = validator
        this._tokenManager = tokenManager

        this.getUsers = this.getUsers.bind(this)
        this.postLogin = this.postLogin.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }



    async getUsers(req, res, next) {
        try {

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
                userRole: userCred.userRole
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
}

module.exports = UsersHandler