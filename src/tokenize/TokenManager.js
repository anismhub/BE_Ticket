const jwt = require('jsonwebtoken')

const TokenManager = {
    generateToken: payload => {
        return jwt.sign(payload, process.env.SECRET)
    }
}

module.exports = TokenManager