if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur')
const { IMGUR_CLIENT_ID } = process.env.IMGUR_CLIENT_ID
const db = require('../../models')
const { Product, Cart } = db

let productController = {
  getProducts: async (req, res) => {
    try {
      const pageLimit = 9
      let pageOffset = 0
      const page = Number(req.query.page || 1)
      if (page) {
        pageOffset = (page - 1) * pageLimit
      }

      const [products] = await Promise.all([
        Product.findAndCountAll({ raw: true, nest: true, offset: pageOffset, limit: pageLimit })
      ])

      const pages = Math.ceil(products.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => item = index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return res.render('admin/products', { products, totalPage, prev, next })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  getProduct: async (req, res) => {
    try {
      const [product] = await Promise.all([
        Product.findByPk(req.params.id)
      ])

      return res.render('admin/product', { product: product.toJSON() })
    } catch (err) {
      console.log(err)
      res.render('error', { message: 'error !' })
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      await product.destroy()
      req.flash('success_messages', '刪除成功 !')
      res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
      res.render('error', { message: 'error !' })
    }
  },
  addProduct: async (req, res) => {
    try {
      return res.render('admin/addProduct')
    } catch (err) {
      console.log(err)
      res.render('error', { message: 'error !' })
    }
  },
  postProduct: async (req, res) => {
    try {
      const { name, description, price } = req.body
      if (!name || !description || !price || !req.file) {
        req.flash('error_messages', '請完成所有欄位!')
        return res.redirect('/admin/products/new', { name, description, price })
      }

      imgur.setClientId(IMGUR_CLIENT_ID)
      const img = await imgur.uploadFile(req.file.path)
      await Product.create({
        name,
        description,
        price,
        image: img.link
      })

      req.flash('success_messages', '成功新增商品')
      return res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = productController