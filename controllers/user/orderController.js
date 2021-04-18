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
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)

      if (order.payment_status === '1') {
        await order.update({
          ...req.body,
          shipping_status: '-1',
          payment_status: '-1'
        })
        req.flash('success_messages', '訂單已取消，退款作業處理中!')
        return res.redirect('back')
      }

      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })

      req.flash('success_messages', '訂單已取消!')

      return res.redirect('/orders')
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  getPayment: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      const tradeInfo = getTradeInfo(order.amount, '產品名稱', process.env.MY_EMAIL
      )
      const updatedOrder = await order.update({
        ...req.body,
        sn: tradeInfo.MerchantOrderNo
      })
      return res.render('payment', { order: updatedOrder.toJSON(), tradeInfo })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  spgatewayCallback: async (req, res) => {
    try {
      const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

      const orders = await Order.findAll({
        where: { sn: data.Result.MerchantOrderNo }
      })

      await orders[0].update({
        ...req.body,
        payment_status: 1
      })

      return res.redirect('/orders')
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
    return res.redirect('/orders')
  }
}

module.exports = orderController