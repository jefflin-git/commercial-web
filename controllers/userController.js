const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const helpers = require('../_helpers')
const userController = {
  signInPage: (_req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role !== 'admin') {
      req.flash('success_messages', '登入成功！')
      res.redirect('/')
    } else {
      req.flash('error_messages', '管理者請從後台登入！')
      res.redirect('/signin')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Sign out successfully！')
    req.logout()
    res.redirect('/signin')
  },
  signUpPage: (_req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signin')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signin')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複！')
              return res.redirect('/signin')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(_user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }
          })
        }
      })
    }
  },
  successPage: (req, res) => {
    res.render('success')
  }
}

module.exports = userController