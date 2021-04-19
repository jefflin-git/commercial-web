const bcrypt = require('bcryptjs')
const db = require('../../../models')
const User = db.User

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: async (req, res) => {
    try {
      let username = req.body.email
      let password = req.body.password

      // 檢查必要資料
      if (!username || !password) {
        return res.status(400).json({ status: 'error', message: "required fields didn't exist" })
      }

      const user = await User.findOne({ where: { email: username } })

      if (!user) {
        return res.status(400).json({ status: 'error', message: 'no such user found' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id, name: user.name, email: user.email, role: user.role
        }
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: '伺服器錯誤，登入失敗，請再嘗試' })
    }
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (!name || !email || !password || !passwordCheck) {
      return res.json({ status: 'error', message: '請輸入資料！' })
    }
    if (passwordCheck !== password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    }

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        }
        User.create({
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 'user'
        })
          .then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
          .catch(error => {
            console.log(error)
            res.status(500).json({ status: 'fail', message: 'error !' })
          })
      })
  }
}

module.exports = userController