const firebase = require('firebase-admin')

module.exports = async (req, _res, next) => {
    next()
    try {
        if (req.notification === undefined) {
            next()
        }
        
        const notificationData = req.notification
        //await firebase.messaging().send(notificationData)
        console.log(req.notification === undefined)
        console.log(`aaa: ${notificationData}`)
    } catch (error) {
        console.log(error)
    }
}