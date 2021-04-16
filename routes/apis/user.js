const passport = require('passport')
const authenticated = passport.authenticate('jwt', { session: false })
const express = require('express')
const router = express.Router()

const userController = require('../../controllers/api/user/userController')

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

module.exports = router