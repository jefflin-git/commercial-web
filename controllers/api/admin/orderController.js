const orderService = require('../../../services/admin/orderService')

let orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, (data) => {
      return res.json(data)
    })
  },
  cancelOrder: (req, res) => {
    orderService.cancelOrder(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = orderController