const orderService = require('../../../services/user/orderService')

let orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = orderController