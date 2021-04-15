const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const fs = require('fs')

describe('# admin product request', () => {
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

    it('if user go to /admin/products, he should be redirected to root page', (done) => {
      request(app)
        .get('/admin/products')
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
      await db.Product.create({
        name: 'name',
        description: 'description',
        price: '100',
        image: `https://loremflickr.com/320/240/furniture/?lock=${Math.random() * 100
          }`,
        viewCounts: 0
      })
    })

    it('can go to all products page', (done) => {
      request(app)
        .get('/admin/products')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          res.text.should.include('name')
          return done()
        })
    })

    it('can go to add product page', (done) => {
      request(app)
        .get('/admin/products/new')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        })
    })

    it('can go to edit product page', (done) => {
      request(app)
        .get('/admin/products/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        })
    })

    it('successfully update product', (done) => {
      request(app)
        .put('/admin/products/1')
        .send('name=update&description=update&price=100')
        .set('Accept', 'application/json')
        .expect(302)
        .expect('Location', '/admin/products/1')
        .end(function (err, res) {
          if (err) return done(err)
          db.Product.findByPk(1)
            .then(product => {
              product.name.should.equal('update')
              done()
            })
        })
    })

    it('can delete product', (done) => {
      request(app)
        .delete('/admin/products/1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          db.Product.findAll()
            .then(product => {
              expect(product).to.be.an('array').that.is.empty
              done()
            })
        })
    })

    // it('successfully add product', (done) => {
    //   request(app)
    //     .post('/admin/products/new')
    //     .send('name=name&description=description&price=100&image=https://loremflickr.com/320/240/furniture/?lock=49.09887156579118')
    //     .set('Accept', 'application/json')
    //     .expect(302)
    //     .expect('Location', '/admin/products/new')
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       db.Product.findByPk(2)
    //         .then(product => {
    //           product.name.should.equal('name')
    //           done()
    //         })
    //     })
    // })

    // it('successfully add product', (done) => {
    //   request(app)
    //     .post('/admin/products/new')
    //     .set('Content-Type', 'application/x-www-form-urlencoded')
    //     .field('name', 'name')
    //     .field('description', 'description')
    //     .field('price', '100')
    //     .attach('image', fs.readFileSync('./test.jpg'))
    //     .expect(302)
    //     .expect('Location', '/admin/products/new')
    //     .end(function (err, res) {
    //       if (err) return done(err)
    //       db.Product.findByPk(2)
    //         .then(product => {
    //           product.name.should.equal('name')
    //           done()
    //         })
    //     })
  })



  after(async () => {
    this.ensureAuthenticated.restore()
    this.getUser.restore()
    await db.User.destroy({ where: {}, truncate: true })
    await db.Product.destroy({ where: {}, truncate: true })
  })
})