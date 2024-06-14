const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')

const TicketSchema = {
    getTicketPayloadSchema: Joi.object({
        status: Joi.string().required().valid('Open', 'On Progress', 'Closed'),
        search: Joi.string()
    }),
    addTicketPayloadSchema: Joi.object({
        ticketSubject: Joi.string().required(),
        ticketDescription: Joi.string().required(),
        ticketPriority: Joi.string().required().valid('Rendah', 'Sedang', 'Tinggi'),
        ticketArea: Joi.number().required(),
        ticketCategory: Joi.number().required()
    }),
    putAssignPayloadSchema: Joi.object({
        userId: Joi.number().required()
    }),
    postAddCommentPayloadSchema: Joi.object({
        content: Joi.string().required()
    }),
    getExportPayloadSchema: Joi.object({
        startDate: Joi.date().required(),
        endDate: Joi.date().required()
    })
}

const TicketValidator = {
    validateGetTicketPayload: payload => {
        const validationResult = TicketSchema.getTicketPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateAddTicketPayload: payload => {
        const validationResult = TicketSchema.addTicketPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validatePutAssignPayload: payload => {
        const validationResult = TicketSchema.putAssignPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validatePostAddCommentPayload: payload => {
        const validationResult = TicketSchema.postAddCommentPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateGetExportPayload: payload => {
        const validationResult = TicketSchema.getExportPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = TicketValidator