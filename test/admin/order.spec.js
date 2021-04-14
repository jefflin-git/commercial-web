const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')

describe('# admin order request', () => {
  describe('(1) if normal user log in', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      await db.User.create({ name: 'name' })
    })

    it('if user go to /admin/orders, he should be redirected to root page', (done) => {
      request(app)
        .get('/admin/orders')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/products')
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.User.destroy({ where: {}, truncate: true })
    })
  })

  describe('(2) if admin log in', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })
      await db.User.create({ name: 'name' })
      await db.Order.create({
        name: 'name',
        phone: '0912345678',
        address: 'address',
        amount: 1,
        shipping_status: '0',
        payment_status: '0'
      })
    })

    it('can go to all orders page', (done) => {
      request(app)
        .get('/admin/orders')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          res.text.should.include('name')
          return done()
        })
    })

    it('admin can cancel order', (done) => {
      request(app)
        .post('/admin/order/1/cancel')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/admin/orders')
        .end(function (err, res) {
          if (err) return done(err)
          db.Order.findByPk(1)
            .then(order => {
              expect(order.shipping_status).to.equal(-1)
            })
          return done()
        })
    })
  })
})