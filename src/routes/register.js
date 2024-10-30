const express = require('express')
const router = express.Router()
const registerController = require('../app/controllers/registerController')

router.post('/register', registerController.createTeam)
router.get('/register', registerController.getTeams)
router.post('/upload', registerController.uploadImages) // Đổi từ GET sang POST và sửa lại path

module.exports = router
