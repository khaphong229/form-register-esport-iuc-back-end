const registerRouter = require('./register')
const tournamentRouter = require('./tournament')

function route(app) {
  app.use('/', registerRouter)
  app.use('/tournament', tournamentRouter)
}

module.exports = route
