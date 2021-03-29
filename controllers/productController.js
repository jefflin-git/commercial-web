const db = require('../models')
const { Product, Cart } = db
const PAGE_LIMIT = 3;
const PAGE_OFFSET = 0;

let productController = {
  getProducts: async (req, res) => {
    try {
      let totalPrice = 0
      let [products, cart] = await Promise.all([
        Product.findAndCountAll({ raw: true, nest: true, offset: PAGE_OFFSET, limit: PAGE_LIMIT }),
        Cart.findByPk(req.session.cartId, {
          include: [{ model: Product, as: 'items' }],
        })
      ])

      if (!cart) return res.render('products', { products, totalPrice })

      totalPrice = cart.items.length > 0 ? cart.items.map((d) => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      return res.render('products', { products, totalPrice, cart: cart.toJSON() })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = productController