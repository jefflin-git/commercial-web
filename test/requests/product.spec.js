const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')

describe('# product request', () => {
  describe('user not login', () => {
    before((done) => {
      done()
    })
    it('can render product page', (done) => {
      request(app)
        .get('/products')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })
  })
})