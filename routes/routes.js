const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../config/auth')

const userController = require('../controllers/userController')

//註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

//
// router.get('/', userController.successPage)
router.get('/', (req, res) => {
  res.render('success')
})


module.exports = router