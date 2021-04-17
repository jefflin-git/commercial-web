const db = require('../../models')
const { Order, Product } = db

let orderController = {
  getOrders: async (req, res, callback) => {
    try {
      const orders = await Order.findAll({
        include: [{ model: Product, as: 'items' }],
        order: [['id', 'DESC']]
      })
      const ordersJSON = orders.map((order) => order.toJSON())
      callback({ status: 'success', orders: ordersJSON })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '取得全部訂單失敗' })
    }
  },
  cancelOrder: async (req, res, callback) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      callback({ status: 'success', message: '取消訂單成功' })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '取消訂單失敗' })
    }
  }
}

module.exports = orderController