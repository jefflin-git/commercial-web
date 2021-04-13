const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')

describe('# cart request', () => {
  describe('(1) show cart page', () => {
    before((done) => {
      done()
    })
    it('can render cart page', (done) => {
      request(app)
        .get('/cart')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })
  })

  describe('(2) add product to cart', () => {
    before((done) => {
      done()
    })
    it('can redirect to product page when add product to cart', (done) => {
      request(app)
        .post('/cart')
        .send('productId=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, req) {
          if (err) return done(err)
          return done()
        })
    })

    it('if user don`t have a cart, system will create one', (done) => {
      db.Cart.findAll()
        .then(cart => {
          expect(cart).to.not.be.null
          done()
        })
    })

    after(async () => {
      await db.Cart.destroy({ where: {}, truncate: true })
    })
  })

  describe('(3) user can modify quantity of product in the cart', () => {
    before(async () => {
      await db.CartItem.create({
        ProductId: 1,
        quantity: 1
      })
    })

    it('increase quantity', (done) => {
      request(app)
        .post('/cartItem/1/add')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err)
          db.CartItem.findByPk(1)
            .then(cartItem => {
              expect(cartItem).to.equal(2)
            })
          return done()
        })
    })

    it('decrease quantity', (done) => {
      request(app)
        .post('/cartItem/1/sub')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err)
          db.CartItem.findByPk(1)
            .then(cartItem => {
              expect(cartItem).to.equal(1)
            })
          return done()
        })
    })

    it('quantity can`t decrease less than one', (done) => {
      request(app)
        .post('/cartItem/1/sub')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err)
          db.CartItem.findByPk(1)
            .then(cartItem => {
              expect(cartItem).to.equal(1)
            })
          return done()
        })
    })

    after(async () => {
      await db.CartItem.destroy({ where: {}, truncate: true })
    })
  })

  describe('(4) user can delete product in the cart', () => {
    before(async () => {
      await db.CartItem.create({
        ProductId: 1,
        quantity: 1
      })
    })

    it('cat delete successfully', (done) => {
      request(app)
        .delete('/cartItem/1')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err)
          db.CartItem.findByPk(1)
            .then(cartItem => {
              expect(cartItem).to.be.null
            })
          return done()
        })
    })

    after(async () => {
      await db.CartItem.destroy({ where: {}, truncate: true })
    })
  })
})