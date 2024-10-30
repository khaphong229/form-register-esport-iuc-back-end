const Team = require('../models/team')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Tạo đường dẫn tuyệt đối đến thư mục uploads
const uploadDir = path.join(__dirname, '../../../public/uploads')

// Đảm bảo thư mục uploads tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Lưu bằng tên gốc của ảnh, thay khoảng trắng và ký tự đặc biệt
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
    cb(null, safeName)
  }
})

// Cải thiện file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Chỉ chấp nhận file JPG, PNG hoặc GIF!'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).array('images', 10)

class RegisterController {
  // [POST] /upload
  uploadImages(req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File quá lớn. Giới hạn là 5MB'
          })
        }
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

      // Tạo đường dẫn tương đối cho frontend
      const imagePaths = req.files.map((file) => {
        return `/uploads/${path.basename(file.path)}`
      })

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

      // Check if team name already exists
      const existingTeam = await Team.findOne({ name: formData.name })
      if (existingTeam) {
        return res.status(400).json({
          success: false,
          message: 'Tên nhóm đã tồn tại, vui lòng chọn tên khác'
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
        slogan: formData.slogan,
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