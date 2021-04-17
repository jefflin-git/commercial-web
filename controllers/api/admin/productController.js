const productService = require('../../../services/admin/productService')

let productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, (data) => {
      return res.json(data)
    })
  },
  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = productController