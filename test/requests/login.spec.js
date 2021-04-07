const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const bcrypt = require('bcryptjs')
const { requests } = require('sinon')

describe('# login request', () => {
  describe('if user want to signin', () => {
    before(async () => {
      await db.User.create({
        name: 'User1',
        email: 'User1@example.com',
        password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10))
      })
    })

    it('can render signin page', (done) => {
      request(app)
        .get('/signin')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    it('login successfully', (done) => {
      request(app)
        .post('/signin')
        .send('email=User1@example.com&password=User1')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/products')
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    it('login fail', (done) => {
      request(app)
        .post('/signin')
        .send('')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/signin')
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true })
    })
  })

  describe('if user want to logout', () => {
    before((done) => {
      done()
    })
    it('can render signup page', (done) => {
      request(app)
        .get('/signout')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    after((done) => {
      done()
    })
  })

  describe('if user want to signup', () => {
    before((done) => {
      done()
    })

    it('can render signup page', (done) => {
      request(app)
        .get('/signup')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    it('signup successfully', (done) => {
      requests(app)
        .get('/signup')
        .send('name=User1&email=User1@example.com&password=User1&confirmPassword=User1')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/signin')
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true })
    })
  })
})