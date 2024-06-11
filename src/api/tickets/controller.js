const InvariantError = require('../../exceptions/InvariantError')
const ExcelJs = require('exceljs')
const fs = require('fs')
const path = require('path')

class TicketHandler {
    constructor(ticketService, assignService, commentService, resolutionService, validator) {
        this._ticketService = ticketService
        this._assignService = assignService
        this._commentService = commentService
        this._resolutionService = resolutionService
        this._validator = validator

        this.getTickets = this.getTickets.bind(this)
        this.getTicketById = this.getTicketById.bind(this)
        this.postAddTicket = this.postAddTicket.bind(this)
        this.postAssignTicket = this.postAssignTicket.bind(this)
        this.postAddCommentTicket = this.postAddCommentTicket.bind(this)
        this.postCloseTicket = this.postCloseTicket.bind(this)
        this.exportReport = this.exportReport.bind(this)
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

    async getTicketById(req, res, next) {
        try {
            const result = await this._ticketService.getTicketById(req.params.id)
            res.status(200).send(result)
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

    async postAssignTicket(req, res, next) {
        try {
            this._validator.validatePutAssignPayload(req.body)

            await this._ticketService.updateTicket(req.params.id)
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
            await this._ticketService.updateTicket(req.params.id)
            await this._commentService.postComment(req.params.id, req.userId, req.body.content)

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

    async postCloseTicket(req, res, next) {
        try {
            this._validator.validatePostAddCommentPayload(req.body)
            if (req.userRole == 'Teknisi') {
                await this._ticketService.verifyTechAccess(req.params.id, req.userId)
            }
            await this._ticketService.closeTicket(req.params.id)
            await this._resolutionService.addResolution(req.params.id, req.userId, req.body.content)
            const response = {
                error: false,
                status: 201,
                message: 'Ticket berhasil ditutup'
            }
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }

    async exportReport(_req, res, next) {
        try {
            const result = await this._ticketService.exportReport()

            res.setHeader('Content-disposition', 'attachment; filename=tickets.xlsx')
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

            const workbook = new ExcelJs.Workbook()
            const worksheet = workbook.addWorksheet('Ticket')

            worksheet.columns = Object.keys(result[0]).map(key => ({header: key, key: key}))

            worksheet.addRows(result)

            const filePath = path.join(__dirname, 'export.xlsx')

            await workbook.xlsx.writeFile(filePath)

            res.download(filePath, 'export.xlsx', err => {
                if(err) {
                    throw new InvariantError("Gagal export")
                }

                fs.unlink(filePath, unlinkErr => {
                    if (unlinkErr) {
                        throw new InvariantError("Gagal Export")
                    }
                })
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TicketHandler