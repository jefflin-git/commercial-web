const db = require('../models')
const { Product, Cart } = db

let productController = {
  getProducts: async (req, res) => {
    try {
      const pageLimit = 9
      let pageOffset = 0
      const page = Number(req.query.page || 1)
      if (page) {
        pageOffset = (page - 1) * pageLimit
      }

      let totalPrice = 0
      let [products, cart] = await Promise.all([
        Product.findAndCountAll({ raw: true, nest: true, offset: pageOffset, limit: pageLimit }),
        Cart.findByPk(req.session.cartId, {
          include: [{ model: Product, as: 'items' }],
        })
      ])

      const pages = Math.ceil(products.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => item = index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      if (!cart) return res.render('products', { products, totalPrice, totalPage, prev, next })

      totalPrice = cart.items.length > 0 ? cart.items.map((d) => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      return res.render('products', { products, totalPrice, cart: cart.toJSON(), totalPrice, totalPage, prev, next })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      return res.render('product', { product: product.toJSON() })
    } catch (err) {
      console.log(err)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = productController