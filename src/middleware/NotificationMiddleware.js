const firebase = require('firebase-admin')

module.exports = async (req, res, next) => {
    try {
        if (!req.notification) next()
        
        const notificationData = req.notification
        await firebase.messaging().send(notificationData)
    } catch (error) {
        console.log(error)
    }
}