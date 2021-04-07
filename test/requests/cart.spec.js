const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')

describe('# cart request', () => {
  describe('show cart page', () => {
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
  describe('add product to cart', () => {
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
})