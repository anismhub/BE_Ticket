const InvariantError = require('../../exceptions/InvariantError')
const ExcelJs = require('exceljs')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const cryptoJS = require('crypto-js')
const ClientError = require('../../exceptions/ClientError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const NotFoundError = require('../../exceptions/NotFoundError')

class TicketHandler {
    constructor(ticketService, assignService, commentService, resolutionService, tokenService, notificationService, validator) {
        this._ticketService = ticketService
        this._assignService = assignService
        this._commentService = commentService
        this._resolutionService = resolutionService
        this._tokenService = tokenService
        this._notificationService = notificationService
        this._validator = validator

        this.getTickets = this.getTickets.bind(this)
        this.getTicketById = this.getTicketById.bind(this)
        this.postAddTicket = this.postAddTicket.bind(this)
        this.postAssignTicket = this.postAssignTicket.bind(this)
        this.postAddCommentTicket = this.postAddCommentTicket.bind(this)
        this.postCloseTicket = this.postCloseTicket.bind(this)
        this.exportReport = this.exportReport.bind(this)
        this.downloadReport = this.downloadReport.bind(this)
    }

    upload = multer({
        storage: multer.diskStorage({
            destination: path.join(__dirname, '..', '..', '..', 'uploads'),
            filename: (_req, file, cb) => {
                const hash = cryptoJS.MD5(Date.now().toString()).toString()
                cb(null, hash + path.extname(file.originalname))
            }
        }),
        limits: { fileSize: 1000000 },
        fileFilter:  (_req, file,  cb) => {
            const fileTypes = /jpeg|jpg|png|gif/
            const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
            const mimeTye = fileTypes.test(file.mimetype)

            if (mimeTye && extName) {
                return cb(null, true);
              } else {
                cb('Error: Invalid file type!');
              }
        }
    }).single('file')

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

    async postAddTicket(req, res, next) {
        try {
            this._validator.validateAddTicketPayload(req.body)

            const result = await this._ticketService.addTicket(req.userId, req.body)

            const { ticketCode } = req.body

            const response = {
                error: false,
                status: 201,
                message: `Ticket telah ditambahkan dengan id #${ticketCode}-${result}`
            }

            res.status(201).json(response)

            const sentNotifications = new Map()

            this._tokenService.getAdminsToken()
            .then(tokens => {
                const notificationPromises = tokens.map(token => {
                    const promises = []
                    const notificationData = {
                        token: token.token,
                        notification: {
                            title: "Ticket Baru",
                            body: `Tiket #${ticketCode}-${result} telah dibuat oleh ${req.userFullName}`
                        },
                        data: {
                            title: "Ticket Baru",
                            body: `Tiket #${ticketCode}-${result} telah dibuat oleh ${req.userFullName}`,
                            ticketId: `${result}`
                        }
                    }

                    const notificationKey = `${token.userId}-${result}`
                    
                    if (!sentNotifications.has(notificationKey)) {
                        promises.push(this._notificationService.saveNotification(token.userId, result, notificationData.data.body, ticketCode))
                        sentNotifications.set(notificationKey, true)
                    }

                    if (token.token) {
                        promises.push(this._notificationService.sendNotification(notificationData))
                    }

                    return Promise.all(promises)
                })
                
                return Promise.all(notificationPromises)
            })
            .catch(error => {
                console.error('Failed to send notifications:', error)
            })

            
        } catch (error) {
            next(error)
        }
    }

    async postAssignTicket(req, res, next) {
        try {
            this._validator.validatePutAssignPayload(req.body)

            await this._ticketService.updateTicketToOnProgress(req.params.id)
            await this._assignService.addAssignment(req.params.id, req.body.userId)

            const { ticketCode } = req.body

            const response = {
                error: false,
                status: 201,
                message: `berhasil menugaskan Teknisi#${req.body.userId} ke Ticket#${ticketCode}-${req.params.id}`
            }
            res.status(201).json(response)

            const sentNotifications = new Map()

            this._tokenService.getAssignedToken(req.params.id)
            .then(tokens => {
                return Promise.all(tokens.map(token => {
                    const promises = []
                    let notificationData = {
                        token: token.token,
                        notification: {
                            title: "Update Ticket",
                            body: `Anda Baru saja ditugaskan pada ticket#${ticketCode}-${req.params.id}`
                        },
                        data: {
                            title: "Update Ticket",
                            body: `Anda Baru saja ditugaskan pada ticket#${ticketCode}-${req.params.id}`,
                            ticketId: `${req.params.id}`
                        }
                    }
                    if(token.userRole != 'Teknisi') {
                        notificationData.notification.body = `Ticket#${ticketCode}-${req.params.id} anda telah ditugaskan pada teknisi`
                        notificationData.data.body = `Ticket#${ticketCode}-${req.params.id} anda telah ditugaskan pada teknisi`
                    }

                    const notificationKey = `${token.userId}-${req.params.id}`

                    if (!sentNotifications.has(notificationKey)) {
                        promises.push(this._notificationService.saveNotification(token.userId, req.params.id, notificationData.data.body, ticketCode))
                        sentNotifications.set(notificationKey,true)
                    }


                    if (token.token) {
                        promises.push(this._notificationService.sendNotification(notificationData))
                    }

                    return Promise.all(promises)
                }))
            })
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

            const { ticketCode } = req.body

            let fileName = null
            if (req.file) {
                fileName = req.file.filename
            }
            await this._ticketService.updateTicket(req.params.id)
            await this._commentService.postComment(req.params.id, req.userId, req.body.content, fileName)

            const response = {
                error: false,
                status: 201,
                message: 'Komen berhasil ditambahkan'
            }
            res.status(201).json(response)

            const sentNotifications = new Map()

            this._tokenService.getCommentUserToken(req.params.id, req.userId)
            .then(tokens => {
                return Promise.all(tokens.map(token => {
                    const promises = []
                    const notificationData = {
                        token: token.token,
                        notification: {
                            title: "Update Ticket",
                            body: `Ada Komen baru pada Ticket#${ticketCode}-${req.params.id}`
                        },
                        data: {
                            title: "Update Ticket",
                            body: `Ada Komen baru pada Ticket#${ticketCode}-${req.params.id}`,
                            ticketId: `${req.params.id}`
                        }
                    }

                    const notificationKey = `${token.userId}-${req.params.id}`

                    if (!sentNotifications.has(notificationKey)) {
                        promises.push(this._notificationService.saveNotification(token.userId, req.params.id, notificationData.data.body, ticketCode))
                        sentNotifications.set(notificationKey,true)
                    }

                    if (token.token) {
                        promises.push(this._notificationService.sendNotification(notificationData))
                    }

                    return Promise.all(promises)
                }))
            })
        } catch (error) {
            next(error)
        }
    }

    async postCloseTicket(req, res, next) {
        try {
            await this._ticketService.verifyUserAccess(req.params.id, req.userId)
            const { ticketCode } = req.body
            await this._ticketService.closeTicket(req.params.id)
            const response = {
                error: false,
                status: 201,
                message: 'Ticket berhasil ditutup'
            }
            res.status(201).json(response)

            const sentNotifications = new Map()

            this._tokenService.getCloseToken(req.params.id)
            .then(tokens => {
                return Promise.all(tokens.map(token => {
                    const promises = []
                    const notificationData = {
                        token: token.token,
                        notification: {
                            title: "Update Ticket",
                            body: `Tiket#${ticketCode}-${req.params.id} telah ditutup`
                        },
                        data: {
                            title: "Update Ticket",
                            body: `Tiket#${ticketCode}-${req.params.id} telah ditutup`,
                            ticketId: `${req.params.id}`
                        }
                    }

                    const notificationKey = `${token.userId}-${req.params.id}`

                    if (!sentNotifications.has(notificationKey)) {
                        promises.push(this._notificationService.saveNotification(token.userId, req.params.id, notificationData.data.body, ticketCode))
                        sentNotifications.set(notificationKey,true)
                    }

                    if (token.token) {
                        promises.push(this._notificationService.sendNotification(notificationData))
                    }

                    return Promise.all(promises)
                }))
            })
        } catch (error) {
            next(error)
        }
    }

    async exportReport(req, res, next) {
        try {
            this._validator.validateGetExportPayload(req.body)

            const { startDate, endDate } = req.body

            const result = await this._ticketService.exportReport(startDate, endDate)

            const now = new Date();
            const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);
            const timestamp = tenMinutesFromNow.getTime();

            const data = {
                startDate: startDate,
                endDate: endDate,
                valid: timestamp,
                userId: req.userId
            }

            const enc = cryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET)
            const host = req.get('host')
            const protocol = req.protocol

            const url = `${protocol}://${host}/Tickets/Export/${process.env.SALT}${enc}`

            const response = {
                error: false,
                status: 200,
                message: "Success",
                data: {
                    downloadUrl: url,
                    content: result
                }
            }

            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async downloadReport(req, res, next) {
        try {
            if (!req.params.data) {
                throw new ClientError("bad Request")
            }
            if (!req.params.data.startsWith(process.env.SALT)) {
                throw new ClientError("bad Request")
            }
            const enc = req.params.data.slice(process.env.SALT.length)

            const decryptedBytes = CryptoJS.AES.decrypt(enc, process.env.SECRET)
            const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8)
            const data = JSON.parse(decryptedData)

            if (data.userId != req.userId) {
                throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
            }

            const timestamp = Date.now()

            if (data.valid > timestamp) {
                throw new NotFoundError("Link kadaluarsa")
            }

            const result = await this._ticketService.exportReport(data.startDate, data.endDate)

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

    // async exportReport(req, res, next) {
    //     try {
    //         this._validator.validateGetExportPayload(req.query)
    //         const result = await this._ticketService.exportReport(req.query.startDate, req.query.endDate)

    //         res.setHeader('Content-disposition', 'attachment; filename=tickets.xlsx')
    //         res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    //         const workbook = new ExcelJs.Workbook()
    //         const worksheet = workbook.addWorksheet('Ticket')

    //         worksheet.columns = Object.keys(result[0]).map(key => ({header: key, key: key}))

    //         worksheet.addRows(result)

    //         const filePath = path.join(__dirname, 'export.xlsx')

    //         await workbook.xlsx.writeFile(filePath)

    //         res.download(filePath, 'export.xlsx', err => {
    //             if(err) {
    //                 throw new InvariantError("Gagal export")
    //             }

    //             fs.unlink(filePath, unlinkErr => {
    //                 if (unlinkErr) {
    //                     throw new InvariantError("Gagal Export")
    //                 }
    //             })
    //         })
    //     } catch (error) {
    //         next(error)
    //     }
    // }
}

module.exports = TicketHandler