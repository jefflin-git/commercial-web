const passport = require('passport')
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.status(403).json({ status: 'error', message: 'permission denied' })
  } else {
    return res.status(401).json({ status: 'error', message: 'permission denied' })
  }
}
const express = require('express')
const router = express.Router()

const userController = require('../../controllers/api/user/userController')

router.post('/signin', userController.signIn)

module.exports = router

