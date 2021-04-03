const express = require('express')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routers = require('./routes')

const port = 3000

const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const helpers = require('./_helpers')

app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: require('./functions/handlebars-helpers') }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

app.use('/upload', express.static(__dirname + '/upload'))

app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SECRET,
  name: 'go',
  cookie: { maxAge: 80000 },
  resave: false,
  saveUninitialized: false
}))

passport(app)

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

routers(app)

module.exports = app