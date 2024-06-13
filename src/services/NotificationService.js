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

    async saveNotification(userId, ticketId, content) {
        try {
            const query = {
                text: 'INSERT INTO notification (notification_recipient, notification_ticket, notification_content) VALUES ($1, $2, $3) RETURNING notification_id',
                values: [userId, ticketId, content]
            }

            const result = await this._pool.query(query)

            return result.rows[0].notification_id
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = NotificationService