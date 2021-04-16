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
  getProduct: async (req, res) => {
    try {
      let totalPrice = 0
      const [product, cart] = await Promise.all([
        Product.findByPk(req.params.id),
        Cart.findByPk(req.session.cartId, {
          include: [{ model: Product, as: 'items' }]
        })
      ])

      await product.increment('viewCounts', { by: 1 })

      if (!cart) return res.render('product', { product: product.toJSON(), totalPrice })

      totalPrice = cart.items.length > 0 ? cart.items.map((d) => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      return res.render('product', { product: product.toJSON(), cart: cart.toJSON(), totalPrice })
    } catch (err) {
      console.log(err)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = productController