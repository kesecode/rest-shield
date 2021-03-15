import expect from 'chai'
import AuthRouterFactory from '../../model/factories/AuthRouterFactory'
import AuthManagerMock from '../mocks/AuthManagerMock'
import request from 'supertest'
import express from 'express'
import sinon from 'sinon'

const api = express()

describe('Unit-test: auth-router', () => {
  before(() => {
    sinon.stub(console, 'log') // disable console.log
    sinon.stub(console, 'info') // disable console.info
    sinon.stub(console, 'warn') // disable console.warn
    sinon.stub(console, 'error') // disable console.error
  })

  beforeEach(done => setTimeout(done, 250))

  after(() => {
    sinon.restore()
  })

  it('should get a token and 200 back', done => {
    let router = new AuthRouterFactory(new AuthManagerMock(true)).makeRouter()
    let server = api.listen(3002, () => {})
    api.use('/auth', router)

    request(api)
      .post('/auth')
      .then(res => {
        let data = JSON.parse(res.text)
        expect.assert(data.token !== null)
        expect.assert(res.status === 200)
        done()
      })
    server.close()
  })

  it('should get an 403 error back', done => {
    let router = new AuthRouterFactory(new AuthManagerMock(false)).makeRouter()
    let server = api.listen(3002, () => {})
    api.use('/auth', router)

    request(api)
      .post('/auth')
      .then(res => {
        expect.assert(res.status === 403)
        done()
      })
    server.close()
  })
})
