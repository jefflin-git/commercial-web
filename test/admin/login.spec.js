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

describe('# admin login request', () => {
  describe('if admin want to signin', () => {
    before(async () => {
      await db.User.create({
        name: 'User1',
        email: 'User1@example.com',
        password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10)),
        role: 'admin'
      })
    })

    it('can render signin page', (done) => {
      request(app)
        .get('/admin/signin')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    it('login successfully', (done) => {
      request(app)
        .post('/admin/signin')
        .send('email=User1@example.com&password=User1')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/admin/products')
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    it('login fail', (done) => {
      request(app)
        .post('/admin/signin')
        .send('')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('LOcation', '/signin')
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
