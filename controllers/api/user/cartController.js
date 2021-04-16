const cartService = require('../../../services/user/cartService')

const cartController = {
  getCart: (req, res) => {
    cartService.getCart(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = cartController