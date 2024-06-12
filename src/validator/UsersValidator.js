const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')
const { password } = require('pg/lib/defaults')

const UserSchema = {
    loginUserPayloadSchema: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),
    addUserPayloadSchema: Joi.object({
        username: Joi.string().required,
        fullname: Joi.string().required,
        password: Joi.string().required,
        role: Joi.string().required().valid('Administrator', 'Teknisi', 'Karyawan'),
        department: Joi.number().required,
        phoneNumber: Joi.string().required
    })
}

const UserValidator = {
    validateLoginPayload: payload => {
        const validationResult = UserSchema.loginUserPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateAddUserPayload: payload => {
        const validationResult = UserSchema.addUserPayloadSchema.validate(payload)
        
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = UserValidator