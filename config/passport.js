if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Order } = db

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
    (req, username, password, done) => {
      User.findOne({ where: { email: username }, raw: true })
        .then(user => {
          if (!user) {
            return done(null, false, req.flash('error_messages', ' That email is not registered !'))
          }
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return done(null, false, req.flash('error_messages', ' Email or Password incorrect !'))
              }
              return done(null, user)
            })
        })
        .catch(err => {
          done(err, false)
        })
    }))

  // facebook login
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          return done(null, user)
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash,
            role: user
          }))
          .then(user => {
            done(null, user)
          })
          .catch(err => done(err, false))
      })
  }))


  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id
      , {
        include: [
          { model: Order }
        ]
      }
    )
      .then(user => {
        user = user.toJSON()
        return done(null, user)
      })
      .catch(err => done(err, null))
  })

  // JWT login
  const jwt = require('jsonwebtoken')
  const passportJWT = require('passport-jwt')
  const ExtractJwt = passportJWT.ExtractJwt
  const JwtStrategy = passportJWT.Strategy

  let jwtOptions = {}
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  jwtOptions.secretOrKey = process.env.JWT_SECRET

  passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    User.findByPk(jwt_payload.id)
      .then(user => {
        if (!user) return next(null, false)
        return next(null, user)
      })
  }))
}
