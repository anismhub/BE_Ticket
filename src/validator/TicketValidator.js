const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')

const getTicketPayloadSchema = Joi.object({
    status: Joi.string().required().valid('Open', 'On Progress', 'Closed'),
    search: Joi.string()
})

const TicketValidator = {
    validateGetTicketPayload: payload => {
        const validationResult = getTicketPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = TicketValidator