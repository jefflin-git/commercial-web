const cartService = require('../../../services/user/cartService')

const cartController = {
  getCart: (req, res) => {
    cartService.getCart(req, res, (data) => {
      return res.json(data)
    })
  },
  postCart: (req, res) => {
    cartService.postCart(req, res, (data) => {
      return res.json(data)
    })
  },
  addCartItem: (req, res) => {
    cartService.addCartItem(req, res, (data) => {
      return res.json(data)
    })
  },
  subCartItem: (req, res) => {
    cartService.subCartItem(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteCartItem: (req, res) => {
    cartService.deleteCartItem(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = cartController