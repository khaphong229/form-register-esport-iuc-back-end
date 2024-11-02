const dotenv = require('dotenv')
dotenv.config()

const url_client =
  process.env.BUILD_MODE === 'production' ? 'https://esport-open-udu.vercel.app' : 'http://localhost:3000'

console.log('Client URL:', url_client)

module.exports = url_client
