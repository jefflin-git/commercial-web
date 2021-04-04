const db = require('../../models')
const { User } = db
const helpers = require('../../_helpers')

const adminController = {
  AdminSignInPage: (_req, res) => {
    return res.render('adminSignin')
  },
  AdminSignIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('success_messages', 'Sign in successfully！')
      res.redirect('/admin/products')
    } else {
      req.logout()
      req.flash('error_messages', '使用者請從前台登入！')
      res.redirect('/admin/signin')
    }
  }
}

module.exports = adminController