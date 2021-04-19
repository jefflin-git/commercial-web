const orderService = require('../../services/user/orderService')

let orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('orders', data)
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
  postOrder: (req, res) => {
    orderService.postOrder(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.redirect('/orders')
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
  cancelOrder: (req, res) => {
    orderService.cancelOrder(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.redirect('back')
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
  getPayment: (req, res) => {
    orderService.getPayment(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('payment', data)
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
  spgatewayCallback: (req, res) => {
    orderService.spgatewayCallback(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.redirect('/orders')
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
  }
}

module.exports = orderController