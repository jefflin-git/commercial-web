const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../../functions/auth')

const userController = require('../../controllers/user/userController')
const cartController = require('../../controllers/user/cartController')
const productController = require('../../controllers/user/productController')
const orderController = require('../../controllers/user/orderController')

//註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/signout', userController.logout)


router.get('/', auth.authenticatedUser, cartController.getCart)
router.get('/cart', cartController.getCart)
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

router.get('/orders', auth.authenticatedUser, orderController.getOrders)
router.post('/order', auth.authenticatedUser, orderController.postOrder)
router.post('/order/:id/cancel', auth.authenticatedUser, orderController.cancelOrder)

router.get('/order/:id/payment', auth.authenticatedUser, orderController.getPayment)
router.post('/orders/spgateway/callback', orderController.spgatewayCallback)

module.exports = router