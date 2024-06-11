const firebase = require('firebase-admin')
const serviceAccount = require('../key/service_account.json')

module.exports = () => {
    firebase.initializeApp({
        credential: serviceAccount
    })

    console.log("Initialize Firebase SDK")
}