const db = require('../models')
const { Order, Product, OrderItem, Cart } = db

let orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        include: [{ model: Product, as: 'items' }]
      })
      return res.render('orders', { orders })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  postOrder: async (req, res) => {
    try {
      const { cartId, name, address, phone, amount, shipping_status, payment_status } = req.body
      const [cart, order] = await Promise.all([
        Cart.findByPk(cartId, { include: [{ model: Product, as: 'items' }] }),
        Order.create({
          name,
          address,
          phone,
          shipping_status,
          payment_status,
          amount
        })
      ])
      const createOrderItem = cart.items.map(product => {
        OrderItem.create({
          OrderId: order.id,
          ProductId: product.id,
          price: product.price,
          quantity: product.CartItem.quantity
        })
      })
      await Promise.all([...createOrderItem])
      return res.redirect('/orders')
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      return res.redirect('back')
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = orderController