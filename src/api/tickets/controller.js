class TicketHandler {
    constructor(ticketService, assignService, commentService, validator) {
        this._ticketService = ticketService
        this._assignService = assignService
        this._commentService = commentService
        this._validator = validator

        this.getTickets = this.getTickets.bind(this)
        this.postAddTicket = this.postAddTicket.bind(this)
        this.putAssignTicket = this.putAssignTicket.bind(this)
        this.postAddCommentTicket = this.postAddCommentTicket.bind(this)
    }

    async getTickets(req, res, next) {
        try {
            this._validator.validateGetTicketPayload(req.query)

            let result
            switch (req.query.status) {
                case 'Open':
                    result = await this._ticketService.getOpenTickets(req.userRole, req.userId, req.query.search)
                    break
                case 'On Progress':
                    result = await this._ticketService.getProgressTickets(req.userRole, req.userId, req.query.search)
                    break
                case 'Closed':
                    result = await this._ticketService.getClosedTickets(req.userRole, req.userId, req.query.search)
                    break
                default:
                    await this._ticketService.getOpenTickets()
                    break
            }
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

    async postAddTicket(req, res, next) {
        try {
            this._validator.validateAddTicketPayload(req.body)

            const result = await this._ticketService.addTicket(req.userId, req.body)

            const response = {
                error: false,
                status: 201,
                message: `Ticket telah ditambahkan dengan id #${result}`
            }
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }

    async putAssignTicket(req, res, next) {
        try {
            this._validator.validatePutAssignPayload(req.body)

            await this._assignService.addAssignment(req.params.id, req.body.userId)

            const response = {
                error: false,
                status: 201,
                message: `berhasil menugaskan Teknisi#${req.body.userId} ke Ticket#${req.params.id}`
            }
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }

    async postAddCommentTicket(req, res, next) {
        try {
            this._validator.validatePostAddCommentPayload(req.body)
            if (req.userRole == 'Teknisi') {
                await this._ticketService.verifyTechAccess(req.params.id, req.userId)
            }
            await this._commentService.postComment()

            const response = {
                error: false,
                status: 201,
                message: 'Komen berhasil ditambahkan'
            }
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TicketHandler