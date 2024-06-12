const { Pool } = require('pg')
const firebase = require('firebase-admin')

class NotificationService {
    constructor() {
        this._pool = new Pool()
    }

    async sendNotification(notificationData) {
        try {
            await firebase.messaging().send(notificationData)
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = NotificationService