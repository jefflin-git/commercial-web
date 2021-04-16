const passport = require('passport')
const authenticated = passport.authenticate('jwt', { session: false })
const express = require('express')
const router = express.Router()

const userController = require('../../controllers/api/user/userController')
const productController = require('../../controllers/api/user/productController')

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/', productController.getProducts)
router.get('/products', productController.getProducts)

module.exports = router