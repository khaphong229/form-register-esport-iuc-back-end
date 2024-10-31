const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LeaderSchema = new Schema({
  codeLeader: { type: String, required: true },
  emailLeader: { type: String, required: true },
  genderLeader: { type: String, enum: ['male', 'female', 'other'] },
  gradeLeader: { type: String, required: true },
  nameLeader: { type: String, required: true },
  phoneLeader: { type: String, required: true }
})

const MemberSchema = new Schema({
  code: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  grade: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true }
})

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    slogan: { type: String },
    leader: LeaderSchema,
    members: [MemberSchema],
    images: [{ type: String }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Team', TeamSchema)
