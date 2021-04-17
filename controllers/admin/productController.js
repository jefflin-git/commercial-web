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
  postProduct: (req, res) => {
    productService.postProduct(req, res, (data) => {
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
          res.redirect('/admin/products/new', data)
          break
      }
    })
  },
  putProduct: (req, res) => {
    productService.putProduct(req, res, (data) => {
      const id = req.params.id
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.redirect(`/admin/products/${id}`)
          break
        case 'error':
          res.render('error', { message: 'error !' })
          break
        case 'fail':
          req.flash('error_messages', data['message'])
          res.redirect(`/admin/products/${id}`)
          break
      }
    })
  }
}

module.exports = productController