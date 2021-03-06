if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur')
const { IMGUR_CLIENT_ID } = process.env.IMGUR_CLIENT_ID
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

      const [products] = await Promise.all([
        Product.findAndCountAll({ raw: true, nest: true, offset: pageOffset, limit: pageLimit, where: whereQuery, order: [['id', 'ASC']] })
      ])

      if (!products.rows.length) {
        callback({ status: 'fail', message: `找不到和${keyword}有關的商品 !` })
      }

      const pages = Math.ceil(products.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => item = index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return callback({ status: 'success', products, totalPage, prev, next, keyword })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '取得全部商品失敗' })
    }
  },
  getProduct: async (req, res, callback) => {
    try {
      const [product] = await Promise.all([
        Product.findByPk(req.params.id)
      ])
      return callback({ status: 'success', product: product.toJSON() })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: '取特定商品失敗' })
    }
  },
  deleteProduct: async (req, res, callback) => {
    try {
      const product = await Product.findByPk(req.params.id)
      await product.destroy()
      callback({ status: 'success', message: '刪除商品成功' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: '刪除商品失敗' })
    }
  },
  addProduct: async (req, res, callback) => {
    try {
      callback({ status: 'success' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'error !' })
    }
  },
  postProduct: async (req, res, callback) => {
    try {
      const { name, description, price } = req.body
      if (!name || !description || !price || !req.file) {
        callback({ status: 'fail', message: '請完成所有欄位', name, description, price })
      }

      imgur.setClientId(IMGUR_CLIENT_ID)
      const img = await imgur.uploadFile(req.file.path)
      await Product.create({
        name,
        description,
        price,
        image: img.link
      })
      callback({ status: 'success', message: '成功新增商品' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: '新增商品失敗' })
    }
  },
  putProduct: async (req, res, callback) => {
    try {
      const { name, description, price } = req.body
      const id = req.params.id
      if (!name || !description || !price) {
        callback({ status: 'fail', message: '請完成所有欄位', name, description, price })
      }

      const product = await Product.findByPk(id)

      if (req.file) {
        imgur.setClientId(IMGUR_CLIENT_ID)
        const img = await imgur.uploadFile(req.file.path)
        await product.update({
          name,
          description,
          price,
          image: img.link
        })
        callback({ status: 'success', message: '成功更新商品資料' })
      }
      await product.update({
        name,
        description,
        price
      })
      callback({ status: 'success', message: '成功更新商品資料' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: '更新商品資料失敗' })
    }
  }
}

module.exports = productController