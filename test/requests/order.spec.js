const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')

describe('# order request', () => {
  describe('(1) if user login', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      await db.User.create({ name: 'name' })
      await db.Cart.create({ UserId: 1 })
      await db.CartItem.create({ productId: 1 })
    })

    it('can render cart page', (done) => {
      request(app)
        .get('/orders')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    it('can create order', (done) => {
      request(app)
        .post('/order')
        .send('cartId=1&name=name&phone=0912345678&address=address&amount=1&shipping_status=0&payment_status=0')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/orders')
        .end(function (err, res) {
          if (err) return done(err)
          db.Order.findAll()
            .then(orders => {
              expect(orders).to.not.be.null
            })
          return done()
        })
    })

    it('can cancel order', (done) => {
      request(app)
        .post('/order/1/cancel')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/orders')
        .end(function (err, res) {
          if (err) return done(err)
          db.Order.findByPk(1)
            .then(order => {
              expect(order.shipping_status).to.equal(-1)
            })
          return done()
        })
    })


    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.User.destroy({ where: {}, truncate: true })
      await db.Order.destroy({ where: {}, truncate: true })
    })
  })

  describe('(2) if user is visitor', () => {
    before((done) => {
      done()
    })

    it('visitor can`t into order page', (done) => {
      request(app)
        .get('/orders')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/signin')
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })
  })

})