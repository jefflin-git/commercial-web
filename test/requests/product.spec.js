const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')

describe('# product request', () => {
  describe('if user want to see all products', () => {
    before(async () => {
      await db.Product.create({
        name: 'name',
        description: 'description',
        price: '100',
        image: `https://loremflickr.com/320/240/furniture/?lock=${Math.random() * 100
          }`,
        viewCounts: 0
      })
    })

    it('can render products page', (done) => {
      request(app)
        .get('/products')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          res.text.should.include('name')
          return done()
        })
    })

    after(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
    })
  })

  describe('if user want to see specific product', () => {
    before(async () => {
      await db.Product.create({
        name: 'name',
        description: 'description',
        price: '100',
        image: `https://loremflickr.com/320/240/furniture/?lock=${Math.random() * 100
          }`,
        viewCounts: 0
      })
    })

    it('can render products page', (done) => {
      request(app)
        .get('/products?id=1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          res.text.should.include('description')
          return done()
        })
    })

    after(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
    })
  })
})