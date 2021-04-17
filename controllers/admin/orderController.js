const orderService = require('../../services/admin/orderService')

let orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('admin/orders', data)
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
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      return res.redirect('/admin/orders')
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  }
}

module.exports = orderController