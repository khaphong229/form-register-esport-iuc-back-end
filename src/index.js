const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = 3456
const route = require('./routes')
const db = require('./config/database')

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true
}
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

db.connect()

route(app)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
