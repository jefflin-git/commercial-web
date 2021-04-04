const admin = require('./admin.js')
const routes = require('./routes.js')
const auth = require('./auth')

module.exports = app => {
  app.use('/admin', admin)
  app.use('/auth', auth)
  app.use('/', routes)
}