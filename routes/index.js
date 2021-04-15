const admin = require('./modules/admin.js')
const routes = require('./modules/user.js')
const auth = require('./modules/facebookAuth')

module.exports = app => {
  app.use('/admin', admin)
  app.use('/auth', auth)
  app.use('/', routes)
}