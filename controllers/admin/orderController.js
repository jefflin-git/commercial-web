const db = require('../../models')
const { Order, Product } = db

let orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [{ model: Product, as: 'items' }]
      })
      const ordersJSON = orders.map((order) => order.toJSON())
      return res.render('admin/orders', { orders: ordersJSON })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = orderController