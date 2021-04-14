const db = require('../../models')
const { Order, Product } = db

let orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [{ model: Product, as: 'items' }],
        order: [['id', 'DESC']]
      })
      const ordersJSON = orders.map((order) => order.toJSON())
      return res.render('admin/orders', { orders: ordersJSON })
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
      return res.redirect('/admin/orders')
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = orderController