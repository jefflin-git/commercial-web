const productService = require('../../services/admin/productService')

let productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('admin/products', data)
          break
        case 'error':
          res.render('error', { message: 'error !' })
          break
        case 'fail':
          req.flash('error_messages', data['message'])
          res.redirect('back')
          break
      }
    })
  },
  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('admin/product', data)
          break
        case 'error':
          res.render('error', { message: 'error !' })
          break
        case 'fail':
          req.flash('error_messages', data['message'])
          res.redirect('back')
          break
      }
    })
  },
  deleteProduct: (req, res) => {
    productService.deleteProduct(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.redirect('/admin/products')
          break
        case 'error':
          res.render('error', { message: 'error !' })
          break
        case 'fail':
          req.flash('error_messages', data['message'])
          res.redirect('back')
          break
      }
    })
  },
  addProduct: (req, res) => {
    productService.addProduct(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('admin/addProduct')
          break
        case 'error':
          res.render('error', { message: 'error !' })
          break
        case 'fail':
          req.flash('error_messages', data['message'])
          res.redirect('back')
          break
      }
    })
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
  },
  putProduct: async (req, res) => {
    try {
      const { name, description, price } = req.body
      const id = req.params.id
      if (!name || !description || !price) {
        req.flash('error_messages', '請完成所有欄位!')
        return res.redirect(`/admin/products/${id}`)
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
        req.flash('success_messages', '成功更新商品')
        return res.redirect(`/admin/products/${id}`)
      }
      await product.update({
        name,
        description,
        price
      })
      req.flash('success_messages', '成功更新商品')
      return res.redirect(`/admin/products/${id}`)
    } catch (err) {
      console.log(err)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = productController