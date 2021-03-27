const db = require('../models')
const { Product } = db
const PAGE_LIMIT = 3;
const PAGE_OFFSET = 0;

let productController = {
  getProducts: async (req, res) => {
    try {
      let products = await Product.findAndCountAll({ raw: true, nest: true, offset: PAGE_OFFSET, limit: PAGE_LIMIT })
      return res.render('products', { products })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = productController