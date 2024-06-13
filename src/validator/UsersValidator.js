const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')

const UserSchema = {
    loginUserPayloadSchema: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),
    addUserPayloadSchema: Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required().valid('Administrator', 'Teknisi', 'Karyawan'),
        department: Joi.number().required(),
        phoneNumber: Joi.string().required()
    }),
    editUserPayloadSchema: Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        role: Joi.string().required().valid('Administrator', 'Teknisi', 'Karyawan'),
        department: Joi.number().required(),
        phoneNumber: Joi.string().required()
    }),
    changePasswordPayloadSchema: Joi.object({
        password: Joi.string().required()
    }),
    postTokenPayloadSchema: Joi.object({
        deviceId: Joi.string().required(),
        token: Joi.string().required()
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
    },
    validateEditUserPayload: payload => {
        const validationResult = UserSchema.editUserPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateChangePasswordPayload: payload => {
        const validationResult = UserSchema.changePasswordPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validatePostTokenPayload: payload => {
        const validationResult = UserSchema.postTokenPayloadSchema.validate(payload)
        
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = UserValidator