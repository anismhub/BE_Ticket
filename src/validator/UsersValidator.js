const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')

const loginUserPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const UserValidator = {
    validateLoginPayload: payload => {
        const validationResult = loginUserPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = UserValidator