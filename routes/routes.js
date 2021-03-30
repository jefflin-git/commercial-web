const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../config/auth')

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const cartController = require('../controllers/cartController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')

//註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// Admin
router.get('/admin/signin', adminController.AdminSignInPage)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin', failureFlash: true
}), adminController.AdminSignIn)
router.get('/signout', userController.logout)


router.get('/', userController.successPage)

router.get('/cart', cartController.getCart)
router.get('/products', productController.getProducts)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

router.get('/orders', orderController.getOrders)
router.post('/order', orderController.postOrder)
router.post('/order/:id/cancel', orderController.cancelOrder)

router.get('/order/:id/payment', orderController.getPayment)

module.exports = router