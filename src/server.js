require('dotenv').config()

const express = require('express')
const initializeFirebaseSDK = require('./firebase')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const ErrorHandler = require('./middleware/ErrorHandler')
const UserRoutes = require('./api/users/routes')
const TicketRoutes = require('./api/tickets/routes')
const resourcesRoutes = require('./api/resources/routes')

initializeFirebaseSDK()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(resourcesRoutes)
app.use(UserRoutes)
app.use(TicketRoutes)

app.use('/public/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('*', (_, res) => {
    res.send("Backend Application for Ticket System")
})

app.use(ErrorHandler)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})