class TicketHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator

        this.getTickets = this.getTickets.bind(this)
    }

    async getTickets(req, res, next) {
        try {
            this._validator.validateGetTicketPayload(req.query)

            let result
            switch (req.query.status) {
                case 'Open':
                    result = await this._service.getOpenTickets(req.userRole, req.userId, req.query.search)
                    break
                case 'On Progress':
                    result = await this._service.getProgressTickets(req.userRole, req.userId, req.query.search)
                    break
                case 'Closed':
                    result = await this._service.getClosedTickets(req.userRole, req.userId, req.query.search)
                    break
                default:
                    await this._service.getOpenTickets()
                    break
            }
            console.result
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

module.exports = TicketHandler