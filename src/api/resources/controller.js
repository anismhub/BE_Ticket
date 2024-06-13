

class ResourcesHandler {
    constructor(service) {
        this._service = service

        this.getDepartments = this.getDepartments.bind(this)
    }

    async getDepartments(_req, res, next) {
        try {
            const result = await this._service.getDepartments()
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
}

module.exports = ResourcesHandler