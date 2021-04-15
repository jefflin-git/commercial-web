const admin = require('./modules/admin.js')
const user = require('./modules/user.js')
const auth = require('./modules/facebookAuth')
const userApi = require('./apis/user')
const adminApi = require('./apis/admin')

module.exports = app => {
  // app.use('/api/admin', adminApi)
  // app.use('/api', userApi)
  app.use('/admin', admin)
  app.use('/auth', auth)
  app.use('/', user)
}