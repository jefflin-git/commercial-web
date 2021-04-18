if (process.env.NODE_ENV !== 'produciton') {
  require('dotenv').config()
}
const nodemailer = require('nodemailer')
const db = require('../../models')
const { Order, Product, OrderItem, Cart } = db
const getTradeInfo = require('../../functions/tradeInfo')
const { create_mpg_aes_decrypt } = require('../../functions/encryptDecrypt')
const helpers = require('../../_helpers')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
})

let orderController = {
  getOrders: async (req, res, callback) => {
    try {
      const orders = await Order.findAll({
        include: [{ model: Product, as: 'items' }],
        where: { UserId: helpers.getUser(req).id },
        order: [['id', 'DESC']]
      })
      const ordersJSON = orders.map((order) => order.toJSON())
      return callback({ status: 'success', orders: ordersJSON })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '取得訂單資料失敗' })
    }
  },
  postOrder: async (req, res, callback) => {
    try {
      const { cartId, name, address, phone, amount, shipping_status, payment_status } = req.body

      if (!name && !phone && !address) {
        callback({ status: 'fail', message: '請填寫所有表格!' })
      }

      const cart = await Cart.findByPk(cartId, { include: [{ model: Product, as: 'items' }] })

      if (!cart) {
        callback({ status: 'fail', message: '購物車內沒有商品無法成立訂單，請先加入商品!' })
      }

      const order = await Order.create({
        name,
        address,
        phone,
        shipping_status,
        payment_status,
        amount,
        UserId: helpers.getUser(req).id
      })

      const createOrderItem = cart.items.map(product => {
        OrderItem.create({
          OrderId: order.id,
          ProductId: product.id,
          price: product.price,
          quantity: product.CartItem.quantity
        })
      })

      const mailOptions = {
        from: process.env.MY_EMAIL,
        to: address,
        subject: `Order id: ${order.id} is created`,
        text: `Order id: ${order.id} is created. You can now go to website and proceed with payment.`
      }
      const mailSent = transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log(`Email sent: ${mailSent.response}` + info.response)
        }
      })

      await Promise.all([...createOrderItem, mailSent])
      callback({ status: 'success', message: '訂單已成立，請查看您的電子信箱!' })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '訂單成立失敗' })
    }
  },
  cancelOrder: async (req, res, callback) => {
    try {
      const order = await Order.findByPk(req.params.id)

      if (order.payment_status === '1') {
        await order.update({
          ...req.body,
          shipping_status: '-1',
          payment_status: '-1'
        })
        return callback({ status: 'success', message: '訂單已取消，退款作業處理中!' })
      }

      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })

      return callback({ status: 'success', message: '訂單已取消，您不需支付任何費用!' })
    } catch (error) {
      console.log(error)
      callback({ status: 'error', message: '訂單已取消失敗' })
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