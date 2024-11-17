const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
})

const GroupSchema = new mongoose.Schema({
  table: {
    type: String,
    required: true
  },
  teams: [TeamSchema]
})

const RankSchema = new mongoose.Schema(
  {
    data: [GroupSchema]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Rank', RankSchema, 'rank_teams')
