const registerRouter = require('./register')

function route(app) {
  app.use('/', registerRouter)
}

module.exports = route
