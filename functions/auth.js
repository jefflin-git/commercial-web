const helpers = require('../_helpers')

module.exports = {
  authenticatedUser: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role !== 'admin') {
        return next()
      }
      req.flash('error_messages', '權限不足')
      return res.redirect('/admin/products')
    }
    req.flash('error_messages', '請登入！')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      req.flash('error_messages', '權限不足')
      return res.redirect('/products')
    }
    req.flash('error_messages', '請登入！')
    res.redirect('/signin')
  }
}
