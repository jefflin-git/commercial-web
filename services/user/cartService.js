const db = require('../../models')
const { Cart, CartItem, Product } = db

const cartController = {
  getCart: async (req, res, callback) => {
    try {
      let totalPrice = 0
      const cart = await Cart.findByPk(req.session.cartId, {
        include: [{ model: Product, as: 'items' }],
      })
      if (!cart) return callback({ status: 'success', totalPrice })
      totalPrice = cart.items.length > 0 ? cart.items.map((d) => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return callback({
        status: 'success',
        cart: cart.toJSON(),
        totalPrice
      })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: 'error !' })
    }
  },
  postCart: async (req, res, callback) => {
    try {
      const cart = await Cart.findOrCreate({ where: { id: req.session.cartId || 0 } })
      const { id: CartId } = cart[0].dataValues
      let cartItem = await CartItem.findOrCreate({
        where: {
          CartId,
          ProductId: req.body.productId
        },
        default: {
          CartId,
          ProductId: req.body.productId,
        }
      })
      await cartItem[0].update({
        quantity: (cartItem[0].dataValues.quantity || 0) + 1
      })
      req.session.cartId = CartId
      req.session.save()
      callback({ status: 'success', message: '成功加入購物車' })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: 'error !' })
    }
  },
  addCartItem: async (req, res, callback) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.update({
        quantity: cartItem.quantity + 1
      })
      callback({ status: 'success', message: '新增成功' })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '新增失敗' })
    }
  },
  subCartItem: async (req, res, callback) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      if (cartItem.quantity > 1) {
        await cartItem.update({
          quantity: cartItem.quantity - 1
        })
        callback({ status: 'success', message: '減少成功' })
      }
      callback({ status: 'fail', message: '商品數量最少為1，若不需此商品，請點擊垃圾桶刪除' })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '減少失敗' })
    }
  },
  deleteCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.destroy()
    res.redirect('back')
  }
}

module.exports = cartController