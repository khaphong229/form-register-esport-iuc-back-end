const Tournament = require('../models/competition_teams')
const Rank = require('../models/rank_teams')
class TournamentController {
  async getAllTournaments(req, res) {
    try {
      const tournaments = await Tournament.find()
      res.status(200).json(tournaments)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
  async getRankTeam(req, res) {
    try {
      const tournaments = await Rank.find()
      res.status(200).json(tournaments)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
  async updateTeamScore(req, res) {
    try {
      const { tournamentId, tableIndex, teamIndex, newScore } = req.body
      const tournament = await Tournament.findById(tournamentId)
      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        })
      }

      // Kiểm tra xem data[tableIndex] có tồn tại không
      if (!tournament.data || !tournament.data[tableIndex]) {
        return res.status(400).json({
          success: false,
          message: 'Invalid table index'
        })
      }

      // Kiểm tra xem teams[teamIndex] có tồn tại không
      if (!tournament.data[tableIndex].teams || !tournament.data[tableIndex].teams[teamIndex]) {
        return res.status(400).json({
          success: false,
          message: 'Invalid team index'
        })
      }

      // Cập nhật điểm
      tournament.data[tableIndex].teams[teamIndex].score = newScore
      await tournament.save()

      res.status(200).json({
        success: true,
        data: tournament
      })
    } catch (error) {
      console.error('Error in updateTeamScore:', error)
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }
}

module.exports = new TournamentController()
