const admin = require('./admin.js')
const routes = require('./routes.js')

module.exports = app => {
  app.use('/admin', admin)
  app.use('/', routes)
}