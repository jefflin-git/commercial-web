const passport = require('passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
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
const productController = require('../../controllers/api/admin/productController')

router.post('/signin', userController.signIn)

router.get('/products', authenticated, authenticatedAdmin, productController.getProducts)
router.get('/products/:id', authenticated, authenticatedAdmin, productController.getProduct)
router.delete('/products/:id', authenticated, authenticatedAdmin, productController.deleteProduct)
router.post('/products/new', authenticated, authenticatedAdmin, upload.single('image'), productController.postProduct)

module.exports = router

