const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()
const port = 3456
const route = require('./routes')
const db = require('./config/database')

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

db.connect()

route(app)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
