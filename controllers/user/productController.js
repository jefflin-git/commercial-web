const productService = require('../../services/user/productService')

let productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, (data) => {
      if (data['status'] === 'fail') {
        return res.render('error', { message: 'error !' })
      }
      return res.render('products', data)
    })
  },
  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      if (data['status'] === 'fail') {
        return res.render('error', { message: 'error !' })
      }
      return res.render('products', data)
    })
  }
}

module.exports = productController