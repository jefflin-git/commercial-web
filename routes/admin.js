const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../functions/auth')

const adminController = require('../controllers/admin/adminController')
const productController = require('../controllers/admin/productController')

// Admin
router.get('/signin', adminController.AdminSignInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), adminController.AdminSignIn)

module.exports = router