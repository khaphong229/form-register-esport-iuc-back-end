const express = require('express')
const router = express.Router()
const tournamentController = require('../app/controllers/TournamentController')

router.put('/update-score', tournamentController.updateTeamScore)
router.get('/', tournamentController.getAllTournaments)

module.exports = router
