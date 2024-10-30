const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS_WORD}@cluster0.zwdmz.mongodb.net/${process.env.NAME_DB}?retryWrites=true&w=majority&appName=Cluster0`
    )
    console.log('Connect successfully')
  } catch (error) {
    console.log('Connect failure')
  }
}

module.exports = { connect }
