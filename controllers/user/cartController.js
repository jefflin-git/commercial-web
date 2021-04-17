const cartService = require('../../services/user/cartService')

const cartController = {
  getCart: (req, res) => {
    cartService.getCart(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('cart', data)
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
  postCart: (req, res) => {
    cartService.postCart(req, res, (data) => {
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
  addCartItem: (req, res) => {
    cartService.addCartItem(req, res, (data) => {
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
  subCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({
      quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1,
    })
    res.redirect('back')
  },
  deleteCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.destroy()
    res.redirect('back')
  }
}

module.exports = cartController