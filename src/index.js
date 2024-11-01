const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = 3456

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

const route = require('./routes')
const db = require('./config/database')

db.connect()
route(app)

if (process.env.BUILD_MODE == 'production') {
  app.listen(process.env.PORT, () => {
    console.log(`Production: Example app listening on ${process.env.PORT}`)
  })
} else {
  app.listen(port, () => {
    console.log(`Dev: Example app listening on port http://localhost:${port}`)
  })
}
