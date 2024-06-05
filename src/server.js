require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const ErrorHandler = require('./middleware/ErrorHandler')
const UserRoutes = require('./api/users/routes')
const TicketRoutes = require('./api/tickets/routes')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (_, res) => {
    res.send("Backend Application for Ticket System")
})

app.use(UserRoutes)
app.use(TicketRoutes)

app.use(ErrorHandler)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})