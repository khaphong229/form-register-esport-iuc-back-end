const Team = require('../models/team')
const multer = require('multer')
const path = require('path')

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// Filter chỉ nhận file ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Chỉ được upload file ảnh!'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
}).array('images', 10)

class RegisterController {
  // [POST] /upload
  uploadImages(req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: 'Lỗi upload: ' + err.message
        })
      } else if (err) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi: ' + err.message
        })
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn ảnh để upload'
        })
      }

      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`)

      res.json({
        success: true,
        message: 'Upload ảnh thành công',
        data: imagePaths
      })
    })
  }

  // [POST] /register
  async createTeam(req, res) {
    try {
      const formData = req.body

      if (!formData.name || !formData.group || !formData.leader || !formData.members) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        })
      }

      // Format lại dữ liệu members
      const formattedMembers = formData.members.map((member, index) => {
        const num = index + 1
        return {
          code: member[`code${num}`],
          email: member[`email${num}`],
          gender: member[`gender${num}`],
          grade: member[`grade${num}`],
          name: member[`name${num}`],
          phone: member[`phone${num}`]
        }
      })

      // Tạo object mới với dữ liệu đã format
      const teamData = {
        name: formData.name,
        group: formData.group,
        leader: {
          codeLeader: formData.leader.codeLeader,
          emailLeader: formData.leader.emailLeader,
          genderLeader: formData.leader.genderLeader,
          gradeLeader: formData.leader.gradeLeader,
          nameLeader: formData.leader.nameLeader,
          phoneLeader: formData.leader.phoneLeader
        },
        members: formattedMembers,
        images: formData.images
      }

      const team = new Team(teamData)
      await team.save()

      res.json({
        success: true,
        message: 'Tạo team thành công',
        data: team
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo team',
        error: error.message
      })
    }
  }

  // [GET] /register
  async getTeams(req, res) {
    try {
      const teams = await Team.find({})
      res.json({
        success: true,
        data: teams
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách team',
        error: error.message
      })
    }
  }
}

module.exports = new RegisterController()
