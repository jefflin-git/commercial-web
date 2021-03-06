const db = require('../../models')
const { Product, Cart } = db
const { Op } = require('sequelize')

let productController = {
  getProducts: async (req, res, callback) => {
    try {
      const pageLimit = 9
      let pageOffset = 0
      const page = Number(req.query.page || 1)
      if (page) {
        pageOffset = (page - 1) * pageLimit
      }

      let whereQuery = {}
      const keyword = req.query.keyword ? req.query.keyword : ''
      if (keyword) {
        whereQuery.name = { [Op.like]: `%${keyword}%` }
      }

      let totalPrice = 0
      const [products, cart] = await Promise.all([
        Product.findAndCountAll({ raw: true, nest: true, offset: pageOffset, limit: pageLimit, where: whereQuery, order: [['id', 'ASC']] }),
        Cart.findByPk(req.session.cartId, {
          include: [{ model: Product, as: 'items' }]
        })
      ])

      if (!products.rows.length) {
        callback({ status: 'fail', message: `找不到和${keyword}有關的商品 !` })
      }

      const pages = Math.ceil(products.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => item = index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      if (!cart) return callback({ status: 'success', products, totalPrice, totalPage, prev, next, keyword })

      totalPrice = cart.items.length > 0 ? cart.items.map((d) => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      return callback({ status: 'success', products, totalPrice, cart: cart.toJSON(), totalPrice, totalPage, prev, next, keyword })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: 'error !' })
    }
  },
  getProduct: async (req, res, callback) => {
    try {
      let totalPrice = 0
      const [product, cart] = await Promise.all([
        Product.findByPk(req.params.id),
        Cart.findByPk(req.session.cartId, {
          include: [{ model: Product, as: 'items' }]
        })
      ])

      await product.increment('viewCounts', { by: 1 })

      if (!cart) return callback({ status: 'success', product: product.toJSON(), totalPrice })

      totalPrice = cart.items.length > 0 ? cart.items.map((d) => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      return callback({ status: 'success', product: product.toJSON(), cart: cart.toJSON(), totalPrice })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'error !' })
    }
  }
}

module.exports = productController
