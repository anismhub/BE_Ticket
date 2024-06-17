const { Pool } = require('pg')
const firebase = require('firebase-admin')

class NotificationService {
    constructor() {
        this._pool = new Pool()
    }

    async getNotification(userId) {
        const query = {
            text: `SELECT notification_id as "notificationId", notification_ticket as "notificationTicket", notification_content as "notificationContent", notification_create_at as "notificationCreateAt" FROM notification WHERE notification_recipient = $1 ORDER BY notification_create_at DESC`,
            values: [userId]
        }

        const result = await this._pool.query(query)

        return result.rows
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