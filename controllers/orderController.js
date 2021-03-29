const db = require('../models')
const { Order, Product } = db

let orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        include: [{ model: Product, as: 'items' }]
      })

      res.render('orders', { orders })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = orderController