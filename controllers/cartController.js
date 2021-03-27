const db = require('../models')
const { Cart, CartItem } = db

const cartController = {
  getCart: async (req, res) => {
    try {
      let cart = await Cart.findOne({ include: 'items' })
      let totalPrice = cart.items.length > 0 ? cart.items.map(item => item.price * item.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart: cart.toJSON(),
        totalPrice
      })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = cartController